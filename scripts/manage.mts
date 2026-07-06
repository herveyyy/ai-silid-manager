import { db } from "@/db";
import { users } from "@/drizzle/schema";
import { PASSWORD_SALT_ROUNDS } from "@/lib/auth/password";
import type { UserRole } from "@/lib/types/user-types";
import { hash } from "bcryptjs";
import { eq } from "drizzle-orm";
import { randomUUID } from "node:crypto";
import * as readline from "node:readline/promises";
import { stdin, stdout } from "node:process";

const ROLES = users.role.enumValues;

function usage(): never {
    console.error(`Usage:
  bun run manage                         interactive prompts
  bun run manage createUser --name ... --email ... --password ... [--role admin]
  bun run manage setRole --email ... --role ...
  bun run manage setPassword --email ... --password ...

Roles: ${ROLES.join(", ")}`);
    process.exit(1);
}

function parseArgs(argv: string[]): { command: string; flags: Record<string, string> } {
    const [command, ...rest] = argv;
    if (!command) usage();

    const flags: Record<string, string> = {};
    for (let i = 0; i < rest.length; i++) {
        const arg = rest[i];
        if (!arg.startsWith("--")) continue;
        const key = arg.slice(2);
        const value = rest[++i];
        if (!value || value.startsWith("--")) usage();
        flags[key] = value;
    }

    return { command, flags };
}

function requireFlag(flags: Record<string, string>, key: string): string {
    const value = flags[key];
    if (!value) {
        console.error(`Missing required flag: --${key}`);
        usage();
    }
    return value;
}

function parseRole(raw: string): UserRole {
    if (!(ROLES as readonly string[]).includes(raw)) {
        console.error(`Invalid role "${raw}". Expected one of: ${ROLES.join(", ")}`);
        process.exit(1);
    }
    return raw as UserRole;
}

async function ask(rl: readline.Interface, label: string): Promise<string> {
    const answer = (await rl.question(`${label}: `)).trim();
    if (!answer) {
        console.error(`${label} is required.`);
        process.exit(1);
    }
    return answer;
}

async function askRole(rl: readline.Interface, defaultRole = "admin"): Promise<UserRole> {
    while (true) {
        const raw = (await rl.question(`Role (${ROLES.join(", ")}) [${defaultRole}]: `)).trim() || defaultRole;
        if ((ROLES as readonly string[]).includes(raw)) {
            return raw as UserRole;
        }
        console.error(`Invalid role. Choose one of: ${ROLES.join(", ")}`);
    }
}

async function chooseAction(rl: readline.Interface): Promise<"createUser" | "setRole" | "setPassword"> {
    console.log("\nUser management");
    console.log("  1. createUser");
    console.log("  2. setRole");
    console.log("  3. setPassword");

    while (true) {
        const choice = (await rl.question("\nChoose action (1-3): ")).trim();
        switch (choice) {
            case "1":
            case "createUser":
                return "createUser";
            case "2":
            case "setRole":
                return "setRole";
            case "3":
            case "setPassword":
                return "setPassword";
            default:
                console.error("Enter 1, 2, or 3.");
        }
    }
}

async function runInteractive() {
    const rl = readline.createInterface({ input: stdin, output: stdout });

    try {
        const action = await chooseAction(rl);

        switch (action) {
            case "createUser":
                await createUser({
                    name: await ask(rl, "Name"),
                    email: await ask(rl, "Email"),
                    password: await ask(rl, "Password"),
                    role: await askRole(rl),
                });
                break;
            case "setRole":
                await setRole({
                    email: await ask(rl, "Email"),
                    role: await askRole(rl, "admin"),
                });
                break;
            case "setPassword":
                await setPassword({
                    email: await ask(rl, "Email"),
                    password: await ask(rl, "New password"),
                });
                break;
        }
    } finally {
        rl.close();
    }
}

async function getUserByEmail(email: string) {
    const [row] = await db.select().from(users).where(eq(users.email, email)).limit(1);
    if (!row) {
        console.error(`User not found: ${email}`);
        process.exit(1);
    }
    return row;
}

async function hashUserPassword(password: string): Promise<string> {
    return hash(password, PASSWORD_SALT_ROUNDS);
}

async function createUser(input: { name: string; email: string; password: string; role: UserRole }) {
    const [existing] = await db.select({ id: users.id }).from(users).where(eq(users.email, input.email)).limit(1);
    if (existing) {
        console.error(`User already exists: ${input.email}`);
        process.exit(1);
    }

    const id = randomUUID();
    const passwordHash = await hashUserPassword(input.password);

    await db.insert(users).values({
        id,
        name: input.name,
        email: input.email,
        password: passwordHash,
        role: input.role,
        imageUrl: "",
    });

    console.log("User created:", { id, name: input.name, email: input.email, role: input.role, bcryptRounds: PASSWORD_SALT_ROUNDS });
}

async function setRole(input: { email: string; role: UserRole }) {
    const existing = await getUserByEmail(input.email);

    await db.update(users).set({ role: input.role }).where(eq(users.id, existing.id));

    console.log("Role updated:", { id: existing.id, email: existing.email, from: existing.role, to: input.role });
}

async function setPassword(input: { email: string; password: string }) {
    const existing = await getUserByEmail(input.email);
    const passwordHash = await hashUserPassword(input.password);

    await db.update(users).set({ password: passwordHash }).where(eq(users.id, existing.id));

    console.log("Password updated:", { id: existing.id, email: existing.email, bcryptRounds: PASSWORD_SALT_ROUNDS });
}

async function main() {
    if (!process.env.DATABASE_URL) {
        console.error("DATABASE_URL is not set. Run with --env-file=.env");
        process.exit(1);
    }

    const argv = process.argv.slice(2);

    if (argv.length === 0) {
        await runInteractive();
        return;
    }

    const { command, flags } = parseArgs(argv);

    switch (command) {
        case "createUser":
            await createUser({
                name: requireFlag(flags, "name"),
                email: requireFlag(flags, "email"),
                password: requireFlag(flags, "password"),
                role: parseRole(flags.role ?? "admin"),
            });
            break;
        case "setRole":
            await setRole({
                email: requireFlag(flags, "email"),
                role: parseRole(requireFlag(flags, "role")),
            });
            break;
        case "setPassword":
            await setPassword({
                email: requireFlag(flags, "email"),
                password: requireFlag(flags, "password"),
            });
            break;
        default:
            console.error(`Unknown command: ${command}`);
            usage();
    }
}

main()
    .then(() => process.exit(0))
    .catch((err) => {
        console.error(err instanceof Error ? err.message : err);
        process.exit(1);
    });
