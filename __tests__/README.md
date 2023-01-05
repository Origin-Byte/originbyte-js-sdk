We deploy `testract` contract to the local validator.
It is used to set resources up which would otherwise be beyond the scope of the test suite.

The `.tmp` directory

- contains the localnet validator network;
- `originmate` dependency;
- `ntf-protocol` dependency.

Start the localnet validator network with `$ ./bin/start-localnet.sh`.
Then, in a separate terminal, run the test suite with `$ ./bin/test.sh`.
