    import { Request ,Response, NextFunction } from "express";
    import { statusCodes } from "../constants/statusCodes.constants";
    import { User } from "../models/user.models";
    import { Role } from "../models/role.models";

    //higher-order function that takes an array of role names
   export const authorizeRole = (requiredRoles: string[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
        //  Reads the current authenticated user from the request.

        //Retrieves the current user ID from req.currUser.
      const userId = req.currUser?.userId;
      if (!userId) {
        return res.status(statusCodes.UNAUTHORIZED).json({
          success: false,
          message: "Unauthorized: No user information",
        });
      }

      //Fetches the user’s roles from the database.
      const user = await User.findByPk(userId, {
        include: [{ model: Role, as: "roles" }],
      });

      if (!user) {
        return res.status(statusCodes.NOT_FOUND).json({
          success: false,
          message: "User not found",
        });
      }

      //Extracts the role names from the fetched related Role models
      const userRoles = user.roles?.map((r) => r.roleName) || [];
      const hasPermission = requiredRoles.some((role) => userRoles.includes(role));

      if (!hasPermission) {
        return res.status(statusCodes.FORBIDDEN).json({
          success: false,
          message: "Forbidden: Insufficient permissions",
        });
      }

      next();
    } catch (error: any) {
      return res.status(statusCodes.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: "Something went wrong",
        error: error.message,
      });
    }
  };
};
