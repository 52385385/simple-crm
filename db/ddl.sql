CREATE DATABASE simplecms;
CREATE TABLE customer (
    id VARCHAR NOT NULL,
    "status" VARCHAR NOT NULL,
    created TIMESTAMPTZ NOT NULL,
    "name" VARCHAR NOT NULL,
    phone VARCHAR,
    email VARCHAR,
    "address" VARCHAR,
    "description" VARCHAR,
    CONSTRAINT customer_pk PRIMARY KEY (id)
);
CREATE TABLE opportunity (
    id VARCHAR NOT NULL,
    cid VARCHAR NOT NULL,
    "status" VARCHAR NOT NULL,
    "name" VARCHAR NOT NULL,
    created TIMESTAMPTZ NOT NULL,
    CONSTRAINT opportunity_pk PRIMARY KEY (id),
    CONSTRAINT customer_fk FOREIGN KEY (cid) REFERENCES customer(id)
);