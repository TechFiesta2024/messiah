import { Elysia } from "elysia";

import { community } from "./routes/community";

new Elysia().use(community).listen(process.env.PORT || 3000);
