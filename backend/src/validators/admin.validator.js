const { z } = require("zod");

exports.updateRoleSchema = z.object({
  role: z.enum(["ADMIN", "STUDENT"]),
});
