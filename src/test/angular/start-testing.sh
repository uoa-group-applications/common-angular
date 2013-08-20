#!/bin/bash

# start testing server
./bin/scripts/test-server.sh &

# start e2e testing server
./bin/scripts/e2e-test.sh &

# start webserver
./bin/scripts/web-server.sh &

sleep 4

echo "##"
echo "## Testing servers started (at localhost:{9876,8001})"
echo "##"
echo

