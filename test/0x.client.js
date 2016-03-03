'use strict';

/* global describe, it, before, after, sinon, expect  */

// kafka-topics.sh --zookeeper 127.0.0.1:2181/kafka0.9 --create --topicCANSTANTS.TEST_TOPIC --partitions 3 --replication-factor 1

// var Promise = require('bluebird');
var Client  = require('../lib/client');
var Connection  = require('../lib/connection');

var client = new Client({
    clientId: 'client',
});

describe('Client', function () {
    before(client.init.bind(client));
    after(client.end.bind(client));

    beforeEach(client.updateMetadata.bind(client));

    describe('findLeader', function () {
        it('should throw error `UnknownTopicOrPartition`', function () {
            return client.findLeader(CST.TEST_TOPIC, 20)
            .catch(function (error) {
                error.code.should.eql('UnknownTopicOrPartition');
            });
        });

        it('should throw error `LeaderNotAvailable`', function () {
            client.brokerConnections = {};
            return client.findLeader(CST.TEST_TOPIC, 0)
            .catch(function (error) {
                error.code.should.eql('LeaderNotAvailable');
            });
        });

        it('should get the truely leader of brokers', function () {
            return client.findLeader(CST.TEST_TOPIC, 0)
            .then(function (brokerId) {
                client.brokerConnections[brokerId].should.be.an('object');
                client.brokerConnections[brokerId].should.be.instanceof(Connection);
            });
        });

        it('should get the first broker with flag `notfoundOK` when input an invalid partition', function () {
            return client.findLeader(CST.TEST_TOPIC, 20, true)
            .then(function (brokerId) {
                client.brokerConnections[brokerId].should.be.an('object');
                client.brokerConnections[brokerId].should.be.instanceof(Connection);
            });
        });
    });
});
