#!/bin/bash

# Parse the DATABASE_URL to extract host and port
if [[ $DATABASE_URL == *"@"* ]]; then
  DB_HOST=$(echo $DATABASE_URL | sed -e 's,^.*@,,g' -e 's,:.*,,g')
  DB_PORT=$(echo $DATABASE_URL | sed -e 's,^.*@,,g' -e 's,.*:,,g' -e 's,/.*,,g')
else
  DB_HOST="db"
  DB_PORT="5432"
fi

# Use wait-for-it.sh to wait for the database
/app/wait-for-it.sh $DB_HOST:$DB_PORT -- "$@"