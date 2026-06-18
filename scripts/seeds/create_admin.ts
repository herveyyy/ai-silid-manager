import { UserService } from "@/db/service/user.service";
import { GetUserByCredsUsecase } from "@/db/usecase/user/get_user_by_creds.usecase";
import { GetUserOverviewUsecase } from "@/db/usecase/user/get_user_overview.usecase";
import { CreateUsersUsecase } from "@/db/usecase/user/create_users.usecase";
import { GetDashboardAccessUsersUsecase } from "@/db/usecase/user/get_dashboard_access_users.usecase";
import { GetUserByEmailUsecase } from "@/db/usecase/user/get_user_by_email.usecase";
import { UpdateUserDashboardRoleUsecase } from "@/db/usecase/user/update_user_dashboard_role.usecase";

const password = process.argv[2];

if (!password) {
    console.error("Error: password argument is required.");
    console.error("Usage: npm run seed:createSuperAdmin -- <password>");
    process.exit(1);
}

async function createAdmin() {
    const userService = new UserService(
        new GetUserByCredsUsecase(),
        new GetUserOverviewUsecase(),
        new CreateUsersUsecase(),
        new GetDashboardAccessUsersUsecase(),
        new GetUserByEmailUsecase(),
        new UpdateUserDashboardRoleUsecase(),
    );

    const user = await userService.createSuperAdminUser(password);
    console.log("Superadmin created successfully:", user);
}

createAdmin()
    .then(() => process.exit(0))
    .catch((err) => {
        console.error("Failed to create superadmin:", err);
        process.exit(1);
    });
