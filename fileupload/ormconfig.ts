import { File } from "src/file/file.entity";
import {PostgresConnectionOptions} from "typeorm/driver/postgres/PostgresConnectionOptions";


const config: PostgresConnectionOptions = {
    type: "postgres",
    database: "UP",
    host: "localhost",
    port: 5432,
    username: "postgres",
    password: '202122',
    entities: [File],
    synchronize: true
}

export default config;