import { IsString, IsEmail, IsUUID, IsNotEmpty } from "class-validator";
import { UUID } from "crypto";

export class FindUserParamDto{

    @IsNotEmpty()
    @IsUUID()
    id!: string;
}