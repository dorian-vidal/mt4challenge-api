BEGIN;

SET TIME ZONE 'Europe/Paris';

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

DROP TABLE IF EXISTS account CASCADE;
CREATE TABLE account(
    id UUID NOT NULL DEFAULT uuid_generate_v4() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    instance_ip TEXT,
    instance_user TEXT
);

DROP TABLE IF EXISTS challenge CASCADE;
CREATE TABLE challenge(
    id UUID NOT NULL DEFAULT uuid_generate_v4() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    description TEXT NOT NULL,
    score INTEGER NOT NULL,
    ssh_command_verify TEXT NOT NULL,
    ssh_command_expected_result TEXT NOT NULL
);

DROP TABLE IF EXISTS achieved_challenge CASCADE;
CREATE TABLE achieved_challenge(
    id UUID NOT NULL DEFAULT uuid_generate_v4() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    account_id UUID NOT NULL,
    challenge_id UUID NOT NULL,
    CONSTRAINT fk_account_id FOREIGN KEY(account_id) REFERENCES account(id) ON DELETE CASCADE,
    CONSTRAINT fk_challenge_id FOREIGN KEY(challenge_id) REFERENCES challenge(id) ON DELETE CASCADE
);

COMMIT;

------------------------------------------------------------------------------------------------------------------------
------------------------------------------------------------------------------------------------------------------------
------------------------------------------------------------------------------------------------------------------------
------------------------------------------------------------------------------------------------------------------------
------------------------------------------------------------------------------------------------------------------------
------------------------------------------------------------------------------------------------------------------------
------------------------------------------------------------------------------------------------------------------------
INSERT INTO account(first_name, last_name, email)
VALUES ('Patrick', 'Cusable', 'patrick-c-mt4challenge@yopmail.com');

INSERT INTO challenge(description, score, ssh_command_verify, ssh_command_expected_result)
VALUES (
    'Créer un ficher helloworld.txt qui contient "Hello, World!"',
    5,
    'cat ./helloworld.txt',
    'Hello, World!'
);