function getResult(results, result_name, operation_type, element_id, lc_name) {
  let lc_results = results[lc_name];
  let actual_result = {};
  let final_result;
  switch (result_name) {
    case "moment":
      actual_result = lc_results.member_forces.bending_moment_y[element_id];
      break;

    default:
      break;
  }
  if (actual_result) {
    switch (operation_type) {
      case "mid-span":
        final_result = interpolateResult(actual_result, 50);
        break;
      default:
        break;
    }
  }
  return final_result;
}

function interpolateResult(stations_results, desired_station) {
  let closest_distance = Number.MAX_VALUE;
  let station_1, station_2;
  let station_1_index = 0;
  Object.keys(stations_results).forEach((station, index) => {
    let distance = Math.abs(Number(station) - desired_station);
    if (distance <= closest_distance) {
      if (station_1 !== undefined) station_2 = station_1;
      closest_distance = distance;
      station_1 = station;
      station_1_index = index;
    }
  });
  if (station_2 === undefined && station_1_index === 0) station_2 = Object.keys(stations_results)[1];
  let value_1 = stations_results[station_1];
  let value_2 = stations_results[station_2];
  return value_1 + ((value_2 - value_1) * (desired_station - station_1)) / (station_2 - station_1);
}

const structural_utils = {
  getResult,
};
export default structural_utils;
