import {MigrationInterface, QueryRunner} from "typeorm";

export class Teste1628283531361 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            INSERT INTO \"public\".\"oauth_client\"(secret, grants, redirect_uris, access_token_lifetime, refresh_token_lifetime, activated, display_name, company_name, website) 
            VALUES('applemusicclone', 'password,refresh_token', 'http://localhost:3000/', 604800, 604800, true, 'Apple Music Clone', 'Apple Music Clone', 'http://localhost:3000/')`)
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
    }

}
