import { IsUUID, IsNotEmpty } from "class-validator";

export class FindUserParamDto{
    @IsNotEmpty()
    @IsUUID()
    id!: string;
}