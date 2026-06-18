import { PartialType } from "@nestjs/swagger";
import { CreateUserDto } from "./create-user.dto";

export class UpdateUserDto extends PartialType(CreateUserDto) {}

// começar a ver parte de segurança pra implementar o jwt, 
// fazer a parte do /me com id mesmo por enquanto dps é só trocar 

// 