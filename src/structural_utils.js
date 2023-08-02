function getResult(results, result_name, result_direction, operation_type, element_id, lc_name) {
  let lc_results = results[lc_name];
  let actual_result = {};
  let final_result;
  try {
    switch (result_name) {
      case "moment":
        switch (result_direction) {
          case "x":
            actual_result = lc_results.member_forces.torsion[element_id];
            break;
          case "y":
            actual_result = lc_results.member_forces.bending_moment_y[element_id];
            break;
          case "z":
            actual_result = lc_results.member_forces.bending_moment_z[element_id];
            break;
          default:
            break;
        }
        break;
      case "shear":
        switch (result_direction) {
          case "x":
            actual_result = lc_results.member_forces.shear_force_x[element_id];
            break;
          case "y":
            actual_result = lc_results.member_forces.shear_force_y[element_id];
            break;
          case "z":
            actual_result = lc_results.member_forces.shear_force_z[element_id];
            break;
          default:
            break;
        }
        break;
      case "axial":
        actual_result = lc_results.member_forces.axial_force[element_id];
        break;
      case "reaction":
        switch (result_direction) {
          case "x":
            actual_result = lc_results.reactions[element_id]["Fx"];
            break;
          case "y":
            actual_result = lc_results.reactions[element_id]["Fy"];
            break;
          case "z":
            actual_result = lc_results.reactions[element_id]["Fz"];
            break;
          default:
            break;
        }
        break;
      case "displacement":
        switch (result_direction) {
          case "x":
            actual_result = lc_results.member_displacements.displacement_x[element_id];
            break;
          case "y":
            actual_result = lc_results.member_displacements.displacement_y[element_id];
            break;
          case "z":
            actual_result = lc_results.member_displacements.displacement_z[element_id];
            break;
          default:
            break;
        }
        break;
      default:
        break;
    }
  } catch (error) {
    // If anything turns out to be undefined return false
    actual_result = false;
  }

  if (actual_result) {
    switch (operation_type) {
      case "mid-span":
        final_result = interpolateResult(actual_result, 50);
        break;
      case "start":
        final_result = interpolateResult(actual_result, 0);
        break;
      case "end":
        final_result = interpolateResult(actual_result, 100);
        break;
      case "full":
        final_result = { y: Object.values(actual_result), x: Object.keys(actual_result).map((a) => Number(a)) };
        break;
      case "node":
        final_result = actual_result;
        break;
      case "min":
      case "max":
      case "average":
        final_result = interpolateResult(actual_result, operation_type);
        break;
      default:
        break;
    }
  }
  return final_result;
}

function interpolateResult(stations_results, desired_station) {
  if (isNaN(Number(desired_station))) {
    let result_values = Object.values(stations_results);
    switch (desired_station) {
      case "max":
        return Math.max(...result_values);
      case "min":
        return Math.min(...result_values);
      case "average":
        let sum = result_values.reduce((a, b) => b + a);
        return sum / result_values.length;
      default:
        break;
    }
  } else {
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
}

const structural_utils = {
  getResult,
};
export default structural_utils;
