# :scroll: :robot: Receipt Processor :robot: :scroll:

A simple application for providing scores based on scanned receipt data.

## :microscope: Local development

The application can be run locally using Docker and the following commands.

> [!NOTE]
>
> A functioning Docker installation is a prerequisite for this application.
> Docker can be installed by following their [Docker installation guides].

```bash
docker build -t receipt-processor .
docker run -p 3000:3000 -d receipt-processor
```

Once the commands have been run successfully, the site will be available at
http://localhost:3000.

You can pass data to the running endpoints via curl.

```bash
curl -X POST http://localhost:3000/receipts/process \
     -H "Content-Type: application/json" \
     -d @__tests__/data/example-receipt-1.json
```

Using the uuid returned from the `POST` request to the `/receipts/process`
endpoint, you can retrieve the points for the processed receipt.

```bash
curl -X GET http://localhost:3000/receipts/<PROCESSED_RECEIPT_UUID>/points
```

### :raised_hand: Stopping the running container

To bring down the running container, use the following commands to first note
the container ID of the running application and then request that it be stopped.

```bash
docker ps
docker stop <container_id_indicated_by_prior_command>
```

<!-- Link references. -->
> [Docker installation guides]: https://docs.docker.com/get-started/get-docker/