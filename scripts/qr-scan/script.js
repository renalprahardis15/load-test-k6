import { sleep, group, check } from "k6";
import http from "k6/http";
import { uuidv4 } from 'https://jslib.k6.io/k6-utils/1.4.0/index.js';
import { Trend, Counter, Rate } from "k6/metrics";
import { htmlReport } from "https://raw.githubusercontent.com/benc-uk/k6-reporter/main/dist/bundle.js";
import { scenario } from 'k6/execution';

const authorization = "Basic M09tT21iR2dJN2NqNnJsTnRPVTAxRHJNaDpYbkNmb1BPM3FUV24wcGRudnhWbFdVdXpDWW5DOUtMQWZpcmNGU3JucDhyc3Jib3E0OQ==";

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
    qrscan: {
      executor: 'shared-iterations',
      vus: 10,
      iterations: 1000,
      maxDuration: '1h',
    },
  },
};

export function setup() {
  const url1 = "{{url}}";
  const url2 = "{{url}}";

  const responses = http.batch([
    ['GET', url1],
    ['GET', url2],
  ]);

  const data1 = responses[0].json();
  const data2 = responses[1].json();

  return { data1, data2 };
}

export default function (setup) {
  const qrCode = setup.data1.data[scenario.iterationInTest];
  const card = setup.data2.data[scenario.iterationInTest]
  const url =
    "https://{{baseUrl}}/v2/m-integration/qr/scan";

  const payload = JSON.stringify({
    "identifierType": "card",
    "identifier": card.cardNumber,
    "qrCode": qrCode.uniqueCode,
    "country": "ID"
  });

  const params = {
    headers: {
      "Content-Type": "application/json",
      authorization: authorization,
    },
  };

  const response = http.post(url, payload, params, {
    tags: { name: 'QRScan' }
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
    "reports/qr-scan.html": htmlReport(data),
  };
}
