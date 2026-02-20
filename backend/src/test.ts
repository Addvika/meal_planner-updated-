import { AppDataSource } from "./data-source.ts";
import { User } from "./entities/User.ts";

async function main() {
    await AppDataSource.initialize();

    const userRepo = AppDataSource.getRepository(User);

    // create a new user
    const user = userRepo.create({ name: "Alice" });
    await userRepo.save(user);

    // fetch all users
    const users = await userRepo.find();
    console.log(users);

    await AppDataSource.destroy();
}

main().catch(console.error);
