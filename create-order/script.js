import { sleep, group, check } from "k6";
import http from "k6/http";
import { uuidv4 } from 'https://jslib.k6.io/k6-utils/1.4.0/index.js';
import { Trend, Counter, Rate } from "k6/metrics";
import { htmlReport } from "https://raw.githubusercontent.com/benc-uk/k6-reporter/main/dist/bundle.js";

const authorization = "Basic {{token}}";
export const options = {
  ext: {
    loadimpact: {
      distribution: {
        "amazon:sg:singapore": {
          loadZone: "amazon:sg:singapore",
          percent: 100,
        },
      },
    },
  },
  scenarios: {
    createOrder: {
      executor: 'constant-arrival-rate',
      rate: 15,
      timeUnit: '1s',
      duration: '1m',
      preAllocatedVUs: 30,
      maxVUs: 50,
    },
  },
};

export default function (users) {
  const url =
    "https://{{baseUrl}}/v2/m-integration/orders";

  const payload = JSON.stringify({
    "recipient": {
      "firstName": "Load",
      "lastName": "Test",
      "phone": "+6287814912300",
      "email": "john.doe@mail.com",
      "address": "Jl. Kuningan"
    },
    "payment": {
      "type": "tada",
      "cardNumber": "5104550833666132",
      "cardPin": "486787"
    },
    "items": [
      {
        "id": 3,
        "variantId": 21,
        "quantity": 1,
        "phone": "081111111111"
      }
    ]
  });

  const params = {
    headers: {
      "Content-Type": "application/json",
      authorization: authorization,
    },
  };

  const response = http.post(url, payload, params, {
    tags: { name: 'Create Order' }
  });
  check(response, {
    "status code should be 200": (res) => {
      if (res.status !== 200) {
        console.error(
          `FAILED: ${res.body}`
        );
      }
      return res.status === 200;
    },
  });

}

export function handleSummary(data) {
  return {
    "create-order.html": htmlReport(data),
  };
}
