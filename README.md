This backend flushes stats to udp in logstash compatible json format. 

Each data point is sent separately in the following format. For example: 

```json
   {
       "flushTimestamp" : 1406828678000,
                 "type" : "my-metric",
                 "name" : "lmm.demo2.time"
        "type_instance" : "mean"
		"value" : 0.3333333333333333,
 
   }
```

To enable this backend, include 'statsd-json-udp-backend' in the backends
configuration array:
backends: ['statsd-json-udpbackend']

The backend reads the configuration options from the following
'json-udp' hash defined in the main statsd config file:

```json
   {
     jsonUdp: {
      type: 'my-metric', 
      port: "9999", 
    },
```


# Installation
## Option 1
Create a folder 'node_modules' in your statsd folder. 

```
cd node_modules
git clone https://git.symcpe.net/scm/~brian_hsieh/statsd-json-udp-backend.git
```

## Option 2
Go to your statsd folder (cd statsd). 

```
git clone  https://git.symcpe.net/scm/~brian_hsieh/statsd-json-udp-backend.git
npm install statsd-json-udp-backend
```

# Unit Testing and Coding Style check

## Platform 

CentOS 6.5

## Install Coding Style Checker and Mocha

```
yum install npm
npm install -g jscs
npm install -g mocha
```

## Make test

```
make test
```

## Check coding style

``` 
make check_style
```