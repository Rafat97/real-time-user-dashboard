
# Introduction 

A system architecture for handling 10M+ user data with a real time dashboard.  

# Project Prerequisite 

* node js
* npm / yarn 
* docker
* docker-compose 
* nx workspace [It will help you to manage project]
* MongoDB
* Kafka
* Radis


# High Level Architecture 

![High level Architected](./img-docs/high-level-architecture.jpg)


# How to Deploy

## Using docker-compose (Recommended)
```
docker-compose up -d --build
```

## Using Manually 

* First deploy those dependency. Or for all the resources we can run `docker-compose -f docker-compose-resource.yml up -d --build`. 
  * MonngoDB Server. Must Exposed in `27017` Port
  * Redis Server. Must Exposed in`6379` Port. Also, `ALLOW_EMPTY_PASSWORD=yes ,REDIS_DISABLE_COMMANDS=FLUSHDB,FLUSHALL`
  * Zookeeper Server. Must expose in `2181` port
  * Kafka Server, Must expose in `9092` port
* Go to project directory. Run `yarn` . Main reasons is to install the package.
* Run those commend in same order
  * `yarn start user-create-consumer`  
  * `yarn start user` 
  * `yarn start web-ui` 
* web ui will run port `4200`, user service will run port `9000`. user consumer service will consumer kafka user topic.  



# Running/Deployment Flow

```mermaid

graph TD;
    mongo-db--> 
    redis --> 
    zookeeper --> 
    kafka -->
    user-create-consumer(User Consumer For kafka) --> 
    user(User Service) -->
    web-ui(React Web UI) -->
    management-mongo(Mongo Express);
    
```

# Data/Database Table Deletion Flow

```mermaid

graph TD;
    useractivity--> 
    user;
```

# Data Insertion Flow

```mermaid

graph TD;
    user--> 
    useractivity;
```

# How to Generate Bulk User

## Sequence Diagram

```mermaid

sequenceDiagram
    participant Web UI
    participant User Service
    participant Kafka 
    participant User Consumer 
    participant Mongo User Table

    Web UI ->>+ User Service:/v1/generate/users/random/11000000
    User Service ->>+ Kafka: `user.create.bulk.randomusers` topic message produce
    User Service -->>- Web UI: Response
    
    loop Healthcheck

        User Consumer ->>+ Kafka: Already Subscribed Consumer 
        Kafka ->> Kafka: Kafka Check has any consumer

        alt heartbeat check
            User Consumer ->>  Kafka: consumer unable to giving heartbeat 
            Kafka ->> Kafka: Will store the topic 
        end

    end
    Kafka ->>+ User Consumer: Kafka send the message. And, User Consumer will consume the topic. Generate 11000000 user
    loop Async Bulk Insert
        User Consumer ->>+ Mongo User Table: Bulk Insert
    end
    Mongo User Table -->>- User Consumer: Response Data Insert 

```

# How to Get Users
## Sequence Diagram

```mermaid

sequenceDiagram
    participant Web UI
    participant User Service
    participant Radus Cache
    participant Mongo User Table

  
    Web UI ->>+ User Service:/v1/user?limit=10&page=1
    alt If cache exist
        User Service ->>+ Radus Cache: Request for data in Redis Cache
        Radus Cache -->>- User Service: Get Data From Cache
        User Service -->>- Web UI: Respose 
    else If cache not exist
        User Service ->>+ Mongo User Table: Request for data into mongodb
        Mongo User Table ->>+ User Service: Get data form mongodb
        User Service ->>+ Radus Cache: Save Data Into Redis Cache 
        User Service -->>- Web UI: Respose 
    end

```

# Video
## Basic Frontend UI

https://user-images.githubusercontent.com/21246862/184919308-1a5e9562-5796-43ae-96bd-4404f5f6dd60.mp4

<!-- ./img-docs/Video/1.basic-ui-when-no-data.mp4  -->

## Real-Time Update With Bulk User Insert


https://user-images.githubusercontent.com/21246862/184919384-10af0e63-1c5c-4d4d-b9ba-2349754d8f29.mp4

<!-- ./img-docs/Video/2-real-time-update.mp4 -->


