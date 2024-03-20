import conf from "../conf/conf";
import { Client, ID, Databases, Storage, Query } from "appwrite";

export class Service {
    Client = new Client();
    databases;
    bucket;
    constructor(){
        this.Client
        .setEndpoint(conf.appWriteUrl)
        .setProject(conf.appWriteProjectId)
        this.databases = new Databases(this.Client);
        this.bucket = new Storage(this.Client);
    }

    async createPost({title, slug, content, featuredImage, status, userId}){
        try {
            return await this.databases.createDocument(
                conf.appWriteDatabaseId, 
                conf.appWriteCollectionId,
                slug,
                {
                    title,
                    content,
                    featuredImage,
                    status,
                    userId,
                } 
            )
        } catch (error) {
            console.log(`Error creating post ${error.message}`);
        }
    }
    async updatePost(slug, {title,  content, featuredImage, status}){
        try {
            return await this.databases.updateDocument(
                conf.appWriteDatabaseId, 
                conf.appWriteCollectionId,
                slug,
                {
                    title,
                    content,
                    featuredImage,
                    status,
                }
            )
        } catch (error) {
            console.log(`Error updating post ${error.message}`);
        }
    }
    async deletePost(slug){
        try {
            await this.databases.deleteDocument(
                conf.appWriteDatabaseId, 
                conf.appWriteCollectionId,
                slug,
            )
            return true;
        } catch (error) {
            console.log(`Error deleting post ${error.message}`);
            return false;
        }
    }
    async getPost(slug){
        try {
            return await this.databases.getDocument(
                conf.appWriteDatabaseId, 
                conf.appWriteCollectionId,
                slug,
            )
        } catch (error) {
            console.log(`Error getting post ${error.message}`);
            return false;
        }
    }
    async getAllPosts(queries = [Query.equal("status", "active")]){
        try {
            return await this.databases.listDocuments(
                conf.appWriteDatabaseId, 
                conf.appWriteCollectionId,
                queries,
            )
        } catch (error) {
            console.log(`Error getting all posts ${error.message}`);
            return false;
        }
    }

    // file upload services
    async uploadFile(file){
        try {
            return await this.bucket.createFile(
                conf.appWriteBucketId, 
                ID.unique(),
                file
            )
        } catch (error) {
            console.log(`Error uploading file ${error.message}`);
            return false;
        }
    }
    async deleteFile(fileId){
        try {
            await this.bucket.deleteFile(
                conf.appWriteBucketId, 
                fileId
                )
                return true;
            } catch (error) {
                console.log(`Error deleting file ${error.message}`);
                return false;
            }
        }
    async getFilePreview(fileId){
        return await this.bucket.getFile(
            conf.appWriteBucketId, 
            fileId
            )
    }
}

const Service = new Service();
export default Service;