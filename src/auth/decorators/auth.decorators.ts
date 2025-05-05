import { JwtAuthGuard } from "@auth/guards/jwt-auth.guards";
import { UseGuards } from "@nestjs/common";

export const Auth = () => UseGuards(JwtAuthGuard);

