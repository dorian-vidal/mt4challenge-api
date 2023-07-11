/*
************************************************************************************************************************
************************************************************************************************************************
****************************************************** USER FOR API ****************************************************
************************************************************************************************************************
************************************************************************************************************************
*/
CREATE ROLE mt4challengeuser LOGIN PASSWORD 'KEVhYxFpC8Xcvudo';
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO mt4challengeuser;

BEGIN;

/*
************************************************************************************************************************
************************************************************************************************************************
******************************************************* EXTENSION ******************************************************
************************************************************************************************************************
************************************************************************************************************************
*/
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

/*
************************************************************************************************************************
************************************************************************************************************************
******************************************************** TABLES ********************************************************
************************************************************************************************************************
************************************************************************************************************************
*/
DROP TABLE IF EXISTS promo CASCADE;
CREATE TABLE promo(
    id UUID NOT NULL DEFAULT uuid_generate_v4() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE
);

DROP TABLE IF EXISTS account CASCADE;
CREATE TABLE account(
    id UUID NOT NULL DEFAULT uuid_generate_v4() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    promo_id UUID NOT NULL,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    instance_ip TEXT,
    instance_user TEXT,
    CONSTRAINT fk_promo_id FOREIGN KEY(promo_id) REFERENCES promo(id) ON UPDATE CASCADE ON DELETE CASCADE
);

DROP TABLE IF EXISTS admin CASCADE;
CREATE TABLE admin (
    id UUID NOT NULL DEFAULT uuid_generate_v4() PRIMARY KEY,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
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
    CONSTRAINT fk_account_id FOREIGN KEY(account_id) REFERENCES account(id) ON UPDATE CASCADE ON DELETE CASCADE,
    CONSTRAINT fk_challenge_id FOREIGN KEY(challenge_id) REFERENCES challenge(id) ON UPDATE CASCADE ON DELETE CASCADE
);

COMMIT;

/*
************************************************************************************************************************
************************************************************************************************************************
********************************************************* MOCK *********************************************************
************************************************************************************************************************
************************************************************************************************************************
*/
INSERT INTO promo(id, name, slug)
VALUES ('8d885142-01e5-4d67-b62c-2b8fd9de271b', 'HETIC - MT4', 'hetic-mt4');

INSERT INTO account(promo_id, first_name, last_name, email)
VALUES ('8d885142-01e5-4d67-b62c-2b8fd9de271b', 'Patrick', 'Cusable', 'patrick-c-mt4challenge@yopmail.com');

INSERT INTO admin (id, first_name, last_name, email)
VALUES (uuid_generate_v4(), 'admin', 'admin', 'test-admin-mt4challenge-tus7@yopmail.com');

INSERT INTO challenge(description, score, ssh_command_verify, ssh_command_expected_result, ssh_command_expected_result_dynamic)
VALUES (
    'Bienvenue au premier défi !<br/>Pour ce premier défi, nous allons commencer par une tâche fondamentale: créer un fichier <code>helloworld.txt</code>, le fichier doit contenir le texte "Hello, World!". Cela peut sembler simple, mais c''est en fait un élément clé de la programmation, car c''est souvent le premier programme qu''un développeur écrit en apprenant un nouveau langage de programmation.',
    5,
    'cd ~ && cat ./helloworld.txt',
    'Hello, World!',
    false
), (
    'Vous devez créer un fichier <code>byebyeworld.txt</code>, le fichier doit contenir le texte "Bye Bye, World!".',
    7,
    'cd ~ && cat ./byebyeworld.txt',
    'Bye Bye, World!',
    false
), (
    'Pour ce challenge, il est nécessaire de télécharger <a href="https://we.tl/t-jYOz9v07GF">ces fichiers</a>.<br/>Nous avons besoin de compter le nombres de fichier contenant l''extension <code>js</code>, <code>json</code> ou <code>py</code>. Attention! Nous voulons ignorer les fichiers dont la taille est inférieure à 500 kilobytes (kB). Veuillez créer un script <code>count_files.sh</code>',
    15,
    'cd ~ && ./count_files.sh',
    '10',
    false
), (
    'Créer le script <code>today_french.sh</code> qui retourne la date en français dans le format suivant <code>18 avril 2024</code>',
    20,
    'cd ~ && ./today_french.sh',
    'date +''%d %B %Y'' | sed ''s/January/janvier/;s/February/février/;s/March/mars/;s/April/avril/;s/May/mai/;s/June/juin/;s/July/juillet/;s/August/août/;s/September/septembre/;s/October/octobre/;s/November/novembre/;s/December/décembre/''',
    true
);