
// include all the libraries and define the location of the .proto file
// const PROTO_PATH = __dirname + '/proto/employee.proto';
const PROTO_PATH = __dirname + '/employee.proto';

const grpc = require('grpc');
const protoLoader = require('@grpc/proto-loader');
const _ = require('lodash');

// import data.js into server:
let {employees} = require('./data.js');

// load the .proto file using protoLoader and loadSync

let packageDefinition = protoLoader.loadSync(
    PROTO_PATH,
    {keepCase: true,
        longs: String,
        enums: String,
        defaults: true,
        oneofs: true
    });

// get the packages we need from the loaded proto file package Definition

let employee_proto = grpc.loadPackageDefinition(packageDefinition).employee;
//-> get the employee package into employee_proto. now the employee_proto has the proto definition

//implement getDetail:
function getDetails(call, callback) {
    // call has the req parameters and callback is where we need to define the implementation
    callback(null,
        {
            //get employeeID from Input -call.request.id
            //search the employee list to find employee with that id
            // return employee detail
            message: _.find(employees, { id: call.request.id })
        });
}

// create and start the GRPC Server:
function main() {
    //create a new GRPC server
    let server = new grpc.Server();

    // the script in which we add the Service implementation (we have a function in Employee Service in the .proto).
    // this script says we are adding the function in employee_proto.Employee Service and add the Service in the Server
    server.addService(employee_proto.Employee.service, {getDetails: getDetails});

    // the script which tells that the server will start in port 4500 and have no Authentication
    server.bind('0.0.0.0:4500', grpc.ServerCredentials.createInsecure());

    // the script that starts the server
    server.start();
}

main();
