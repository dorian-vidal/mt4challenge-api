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
    ssh_command_expected_result TEXT NOT NULL,
    ssh_command_expected_result_dynamic BOOLEAN NOT NULL DEFAULT false
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

INSERT INTO challenge(description, score, ssh_command_verify, ssh_command_expected_result, ssh_command_expected_result_dynamic)
VALUES (
    'Bienvenue au premier défi !<br/>Pour ce premier défi, nous allons commencer par une tâche fondamentale: créer un fichier <code>helloworld.txt</code>, le fichier doit contenir le texte "Hello, World!". Cela peut sembler simple, mais c''est en fait un élément clé de la programmation, car c''est souvent le premier programme qu''un développeur écrit en apprenant un nouveau langage de programmation.',
    5,
    'cat ./helloworld.txt',
    'Hello, World!',
    false
), (
    'Créer le script <code>today_french.sh</code> qui retourne la date en français dans le format suivant <code>18 avril 2024</code>',
    20,
    './today_french.sh',
    'date +''%d %B %Y'' | sed ''s/January/janvier/;s/February/février/;s/March/mars/;s/April/avril/;s/May/mai/;s/June/juin/;s/July/juillet/;s/August/août/;s/September/septembre/;s/October/octobre/;s/November/novembre/;s/December/décembre/''',
    true
);