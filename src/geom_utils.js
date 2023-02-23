class Vector {
  constructor(xf, yf, zf, xi = 0, yi = 0, zi = 0) {
    this.xi = xi;
    this.yi = yi;
    this.zi = zi;
    this.xf = xf;
    this.yf = yf;
    this.zf = zf;
  }

  getLength = () => {
    return Math.sqrt((this.xf - this.xi) ** 2 + (this.yf - this.yi) ** 2 + (this.zf - this.zi) ** 2);
  };

  getDirectional = () => {
    let length = this.getLength();
    return { x: (this.xf - this.xi) / length, y: (this.yf - this.yi) / length, z: (this.zf - this.zi) / length };
  };

  /**
   * Returns global {x, y, z} coordinates of the end point of the resized vector
   * @param {*} new_length
   * @returns
   */
  resizeVector = (new_length) => {
    let dir_vector = this.getDirectional();
    return { x: this.xi + dir_vector.x * new_length, y: this.yi + dir_vector.y * new_length, z: this.zi + dir_vector.z * new_length };
  };

  /**
   * Calculate a point perpendicular to the vector in the vertical plane
   * @param {"start"|"end"} position - From the start or the ens point of the vector
   * @param {"positive"|"negative"} direction - Positive or negative with respect to the vector
   * @param {*} length - Perpendicular distance to the new point
   * @returns {x:Number, y: Number, z:Number}
   */
  getPerpendicularVerticalPoint = (position, direction, length = 1) => {
    let dir_vector = this.getDirectional();
    let vert_vector = { x: 0, y: 0, z: direction === "positive" ? 1 : -1 };
    if (dir_vector.x === 0 && dir_vector.y === 0) {
      vert_vector.x = direction === "positive" ? 1 : -1;
      vert_vector.z = 0;
    }
    let perp_out_vector = cross_product(dir_vector, vert_vector);
    let perp_vert_vector = cross_product(perp_out_vector, dir_vector);
    let scaled_point = scale_point(perp_vert_vector, length / point_distance(perp_vert_vector));
    if (position === "start") {
      return {
        x: this.xi + scaled_point.x,
        y: this.yi + scaled_point.y,
        z: this.zi + scaled_point.z,
      };
    } else {
      return {
        x: this.xf + scaled_point.x,
        y: this.yf + scaled_point.y,
        z: this.zf + scaled_point.z,
      };
    }
  };
}

/**
 *
 * @param {Vector} vector
 * @param {Number} vector_size - Actual length of the arrow
 */
function getPlotableArrow(vector, vector_size) {
  let alpha = (15 * Math.PI) / 180;
  let arrow_body_factor = 0.2;
  let plot_coords = { x: [], y: [], z: [] };
  let x_close = vector.xi;
  let y_close = vector.yi;
  let z_close = vector.zi;
  let far_coords = vector.resizeVector(vector_size);
  let resized_vector = new Vector(far_coords.x, far_coords.y, far_coords.z, x_close, y_close, z_close);
  let x_far = far_coords.x;
  let y_far = far_coords.y;
  let z_far = far_coords.z;
  // Arrow body far point
  plot_coords.x.push(x_far);
  plot_coords.y.push(y_far);
  plot_coords.z.push(z_far);
  // Arrow body node point
  plot_coords.x.push(x_close);
  plot_coords.y.push(y_close);
  plot_coords.z.push(z_close);
  // Arrow line up
  let perp_coords_up = resized_vector.getPerpendicularVerticalPoint("end", "positive", vector_size * Math.tan(alpha));
  let arrow_vector_up = new Vector(perp_coords_up.x, perp_coords_up.y, perp_coords_up.z, x_close, y_close, z_close);
  let arrow_coords_up = arrow_vector_up.resizeVector(arrow_body_factor * vector_size);
  plot_coords.x.push(arrow_coords_up.x);
  plot_coords.y.push(arrow_coords_up.y);
  plot_coords.z.push(arrow_coords_up.z);
  // Arrow line down
  let perp_coords_down = resized_vector.getPerpendicularVerticalPoint("end", "negative", vector_size * Math.tan(alpha));
  let arrow_vector_down = new Vector(perp_coords_down.x, perp_coords_down.y, perp_coords_down.z, x_close, y_close, z_close);
  let arrow_coords_down = arrow_vector_down.resizeVector(arrow_body_factor * vector_size);
  plot_coords.x.push(x_close);
  plot_coords.y.push(y_close);
  plot_coords.z.push(z_close);
  plot_coords.x.push(arrow_coords_down.x);
  plot_coords.y.push(arrow_coords_down.y);
  plot_coords.z.push(arrow_coords_down.z);
  return plot_coords;
}

function cross_product(point_1, point_2) {
  return {
    x: point_1.y * point_2.z - point_1.z * point_2.y,
    y: point_1.z * point_2.x - point_1.x * point_2.z,
    z: point_1.x * point_2.y - point_1.y * point_2.x,
  };
}

function scale_point(point, scalar) {
  return {
    x: point.x * scalar,
    y: point.y * scalar,
    z: point.z * scalar,
  };
}

function point_distance(point) {
  return Math.sqrt(point.x ** 2 + point.y ** 2 + point.z ** 2);
}

const geom_utils = { Vector, getPlotableArrow };

export default geom_utils;
