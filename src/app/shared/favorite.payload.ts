import { PostModel } from "./post-model";

export class FavoritePayload{
    postId!: number;
    userName?:string;
    dateAdded?: Date;
    post?: PostModel;
}