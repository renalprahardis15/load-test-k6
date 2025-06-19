import { sleep, group, check } from "k6";
import http from "k6/http";
import { uuidv4 } from 'https://jslib.k6.io/k6-utils/1.4.0/index.js';
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
    memberAdd: {
      executor: 'constant-vus',
      vus: 100,
      duration: '5m'
    },
  },
};

export default function (users) {
  const url =
    "https://{{baseUrl}}/v2/m-integration/members/add";

  const id = `test_${uuidv4()}@mailinator.com`
  const payload = JSON.stringify({
    "identifierType": "email",
    "identifier": id,
    "programId": "2025032011031"
  });

  const params = {
    headers: {
      "Content-Type": "application/json",
      authorization: authorization,
    },
  };

  console.log('Member => ', id)
  const response = http.post(url, payload, params, {
    tags: { name: 'MemberAdd' }
  });
  check(response, {
    "status code should be 200": (res) => {
      if (res.status !== 200) {
        console.error(
          `FAILED MEMBER ADD ${id}: ${res.body}`
        );
      }
      return res.status === 200;
    },
  });

}

export function handleSummary(data) {
  return {
    "add-member.html": htmlReport(data),
  };
}
