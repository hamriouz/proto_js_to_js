// load the employee package into the employee_proto
// const PROTO_PATH = __dirname + '/proto/employee.proto';
const PROTO_PATH = __dirname + '/employee.proto';
const grpc = require('grpc');
const protoLoader = require('@grpc/proto-loader');

let packageDefinition = protoLoader.loadSync(
    PROTO_PATH,
    {keepCase: true,
        longs: String,
        enums: String,
        defaults: true,
        oneofs: true
    });
let employee_proto = grpc.loadPackageDefinition(packageDefinition).employee;

function main() {
// call the RPC -> we need to be able to call the getDetail function -> create a stub in client
    let client = new employee_proto.Employee('localhost:4500',
        grpc.credentials.createInsecure());
// the client stub will help us call getDetail defined in Employee Service running on the server
// no Authentication used

    let employeeId;
    if (process.argv.length >= 3) {
        employeeId = process.argv[2];
    } else {
// call the getDetail func
        let employeeId = 1;
        client.getDetails({id: employeeId}, function (err, response) {
            console.log('Employee Details for Employee Id:', employeeId, '\n', response.message);
            // the response comes in the response var
        });
    }
}
main();

// the client has called the getDetails in server, the client has passed the input for employeeID
// the server went over the data, found the employee with id = 1 and returned the data to the client