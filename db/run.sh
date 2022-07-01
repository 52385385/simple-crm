#!/bin/bash
docker run -d --name postgres -e POSTGRES_PASSWORD=test123 -v $PWD/.data:/var/lib/postgresql/data -p 5432:5432 postgres
