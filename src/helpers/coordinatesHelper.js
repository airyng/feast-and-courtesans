/**
 * Метод возвращает длину отрезка, заданного крайними точками
 * @param {Object} pnt1 - 1я точка вида {x, y}
 * @param {Object} pnt2 - 2я точка вида {x, y}
 * @returns {Number}
 */
export const lineLengthByPoints = (pnt1, pnt2) => {
  return Math.sqrt(Math.pow(pnt2.x - pnt1.x, 2) + Math.pow(pnt2.y - pnt1.y, 2));
};
/**
 * Метод возвращает новую координату точки в результате поворота на angle радиан
 * вокруг точки origin
 * @param {Object} point - исходная точка вида {x, y}
 * @param {Object} origin - точка привязки вида {x, y}
 * @param {Number} angle - угол поворота точки в радианах
 * @returns {Object}
 */
export const rotatePoint = (point, origin, angle) => {
  return {
    x:
      (point.x - origin.x) * Math.cos(angle) -
      (point.y - origin.y) * Math.sin(angle) +
      origin.x,
    y:
      (point.x - origin.x) * Math.sin(angle) +
      (point.y - origin.y) * Math.cos(angle) +
      origin.y,
  };
};
/**
 * Метод возвращает координаты точки, которая находится на отрезке между двумя другими точками,
 *  на заданном расстоянии
 * @param {Object} point1 - {x,y} координаты 1й точки
 * @param {Object} point2 - {x,y} координаты 2й точки
 * @param {Number} distance - расстояние на котором лежит искомая точка от 1й точки
 * @returns {Object} {x,y}
 */
export const pointBetweenPointsByLength = (point1, point2, distance) => {
  const length = lineLengthByPoints(point1, point2);
  return {
    x: point1.x + (distance * (point2.x - point1.x)) / length,
    y: point1.y + (distance * (point2.y - point1.y)) / length,
  };
};
/**
 * Метод возвращает координаты точки, которая находится между двумя другими точками,
 * на заданном в процентах расстоянии от 1й точки отрезка
 * @param {Object} point1 1я точка вида {x, y}
 * @param {Object} point2 2я точка вида {x, y}
 * @param {Number} percent заданное в процентах расстояние от 1й точки
 * @returns {Object} точка вида {x, y}
 */
export const pointBetweenPointsByPercent = (point1, point2, percent) => {
  const length = lineLengthByPoints(point1, point2),
    distance = (percent / 100) * length;
  return pointBetweenPointsByLength(point1, point2, distance);
};

/**
 * Метод возвращает координаты точки, которая находится на отрезке между двумя другими точками,
 *  на заданном расстоянии
 * @param {Array} массив объектов крайних точек вида {x, y}
 * @param {Number} distance - расстояние на котором лежит искомая точка от 1й точки отрезка
 * @returns {Object} {x,y}
 */
export const pointOnFragmentByDistance = ([point1, point2], distance) => {
  return pointBetweenPointsByLength(point1, point2, distance);
};
/**
 * Метод возвращает координаты точки, которая находится на отрезке,
 *  на заданном в процентах расстоянии от 1й точки отрезка
 * @param {Array} массив объектов крайних точек вида {x, y}
 * @param {Number} percent заданное в процентах расстояние от 1й точки
 * @returns {Object} точка вида {x, y}
 */
export const pointOnFragmentByPercent = ([point1, point2], percent) => {
  return pointBetweenPointsByPercent(point1, point2, percent);
};

/**
 * Метод возвращает двойной массив всех точек узлов, лежащих в диапазоне {minX, minY, maxX, maxY}
 * @param {Object} extremums - {minX, minY, maxX, maxY} - граничные точки диапазона по горизонтали и вертикали
 * @returns {Array} [[{x,y},...]]
 */
export const gridFromRanges = ({ minX, minY, maxX, maxY }) => {
  return _.range(minX, maxX + 1).map(x => {
    return _.range(minY, maxY + 1).map(y => ({ x, y }));
  });
};
/**
 * Метод возвращает длину отрезка, заданного массивом крайних точек
 * @param {Array} - массив объектов крайних точек вида {x, y}
 * @param {Object} pnt1 - 1я точка вида {x, y}
 * @param {Object} pnt2 - 2я точка вида {x, y}
 * @returns {Number}
 */
export const lineLength = ([pnt1, pnt2]) => {
  return lineLengthByPoints(pnt1, pnt2);
};
/**
 * Метод возвращает длину линий массива lines
 * @param {Array} lines - массив линий вида [ [{x, y}, {x, y}], ... ]
 * @returns {Number} длина линий
 */
export const linesLength = lines => {
  return lines.reduce((sum, line) => {
    return sum + lineLength(line);
  }, 0);
};

/**
 * Метод возвращает длину ломаной линии, заданной точками
 * @param {Array} pnts - массив точек вида [{x, y}, {x, y},...]
 * @returns {Number} длина ломаной линии
 */
export const polylineLength = pnts => {
  return linesLength(linesFromPoints(pnts));
};
/**
 * Метод возвращает массив линий, заданных последовательными точками
 * @param {Array} pnts - массив точек вида [{x, y}, {x, y},...]
 * @returns {Array} массив линий вида [[{x, y}, {x, y}],...]
 */
export const linesFromPoints = pnts => {
  return pnts
    .map((pnt, idx, arr) => {
      return idx < arr.length - 1 ? [pnt, arr[idx + 1]] : null;
    })
    .filter(sideData => sideData);
};
/**
 * Метод определяет координату пересечения двух переданных линий
 * @param {Object} pnt1 начальная точка 1го отрезка - {x, y}
 * @param {Object} pnt2 конечная точка 1го отрезка - {x, y}
 * @param {Object} pnt3 начальная точка 2го отрезка - {x, y}
 * @param {Object} pnt4 конечная точка 2го отрезка - {x, y}
 * @returns {Object|Boolean} точка пересечения {x, y}, если есть пересечение или `false`, если пересечений нет
 * !!!метод дает точку пересечения линий, проходящих через точки!!! отрезки [pnt1, pnt2] и [pnt3, pnt4] могут при этом не пересекаться.
 * более точный результат пересечения отрезков дает метод fragmentsCrossPoint
 */
export const crossPoint = (pnt1, pnt2, pnt3, pnt4) => {
  let n = null,
    dot = [];
  if (pnt2.y - pnt1.y !== 0) {
    // a(y)
    const q = (pnt2.x - pnt1.x) / (pnt1.y - pnt2.y),
      sn = pnt3.x - pnt4.x + (pnt3.y - pnt4.y) * q, // c(x) + c(y)*q
      fn = pnt3.x - pnt1.x + (pnt3.y - pnt1.y) * q; // b(x) + b(y)*q
    if (!sn) {
      return false;
    } // Пересечений нет
    n = fn / sn;
  } else {
    if (!(pnt3.y - pnt4.y)) {
      return false;
    } // Пересечений нет
    n = (pnt3.y - pnt1.y) / (pnt3.y - pnt4.y); // c(y)/b(y)
  }
  dot[0] = pnt3.x + (pnt4.x - pnt3.x) * n; // pnt3.x + (-b(x))*n
  dot[1] = pnt3.y + (pnt4.y - pnt3.y) * n; // pnt3.y +(-b(y))*n
  return { x: dot[0], y: dot[1] };
};
/**
 * Метод определяет координату пересечения двух отрезков (!!не линий!!)
 * @param  {Array} - массив крайних точек 1го и 2го отрезка вида [{x, y},{x, y}]
 * @returns {Object|Boolean} точка пересечения {x, y}, если есть пересечение или `false`, если пересечений нет
 * !!!случай, если отрезки лежат на одной прямой и имеют общую вершину,
 * метод обрабатывает, как параллельные отрезки и отсутствие пересечения!!!
 */
export const fragmentsCrossPoint = ([pnt1, pnt2], [pnt3, pnt4]) => {
  const isEquals = isEqualLines([pnt1, pnt2], [pnt3, pnt4]), //отрезки совпадают
    isParallels = isFragmentsParallel([pnt1, pnt2], [pnt3, pnt4]), //отрезки параллельны
    crossPnt =
      isEquals || isParallels ? null : crossPoint(pnt1, pnt2, pnt3, pnt4),
    isCrossOnFragment =
      isEquals || isParallels
        ? false
        : isCrossPointOnFragment(crossPnt, [pnt1, pnt2]) &&
          isCrossPointOnFragment(crossPnt, [pnt3, pnt4]);
  return isEquals || isParallels || !isCrossOnFragment ? false : crossPnt;
};
/**
 * Метод возвращает координаты середины отрезка [pnt1, pnt2]
 * @param {Object} pnt1 - 1я точка вида {x, y}
 * @param {Object} pnt2 - 2я точка вида {x, y}
 * @returns {Object} точка {x, y} середины отрезка
 */
export const centerBetweenPoints = (pnt1, pnt2) => {
  return { x: (pnt1.x + pnt2.x) / 2, y: (pnt1.y + pnt2.y) / 2 };
};
/**
 * Метод возвращает данные отрезка
 * @param  {Array} - массив крайних точек отрезка вида [{x, y},{x, y}]
 * @returns {Object} Объект данных {vx = х-вектор, vy = y-вектор, nx = х-ед. вектор, ny = y-ед. вектор, length = длина}
 */
export const fragmentData = ([pnt1, pnt2]) => {
  // Параметрическое уравнение отрезка => x = x0 + vx*t (где vx = x1 - x0 при 0 <= t <= 1), y = y0 + vy*t (где vy = y1 - y0 при 0 <= t <= 1)
  const vx = pnt2.x - pnt1.x, //x-вектор отрезка
    vy = pnt2.y - pnt1.y, //y-вектор отрезка
    length = Math.sqrt(vx * vx + vy * vy), //длина вектора
    nx = vx / length, //нормализация x-вектора
    ny = vy / length; //нормализация y-вектора
  return { vx, vy, nx, ny, length };
};
/**
 * Метод возвращает соотношение длин отрезков, полученных из отрезка [pnt1, pnt2] точкой пересечения pnt
 * @param {Array} line - массив двух точек основного отрезка [{x, y}, {x, y}]
 * @param {Object} pnt - точка пересечения {x, y}
 * @returns {Number} соотношение длин 1го и 2го отрезков, полученных из отрезка [pnt1, pnt2] точкой пересечения pnt
 */
export const fragmentsRatio = ([pnt1, pnt2], pnt) => {
  const startLength = lineLengthByPoints(pnt1, pnt),
        endLength = lineLengthByPoints(pnt, pnt2);
  return startLength / endLength;
};
/**
 * Метод возвращает флаг, являются ли числа массива обратно пропорциональными между собой
 * @param {Array} ratios - массив двух чисел
 * @returns {Boolean} true = числа массива обратно пропорциональны между собой, false = обратной пропорции нет
 */
export const isInverseRatio = ratios => {
  return Math.abs(ratios[0] - 1 / ratios[1]) < 0.005;
};
/**
 * Метод возвращает флаг, являются ли числа массива одинаковыми
 * @param {Array} ratios - массив двух чисел
 * @returns {Boolean} true = числа массива одинаковы, false = не одинаковы
 */
export const isDirectRatio = ratios => {
  const scale = 10000;
  return Math.round(ratios[0] * scale) === Math.round(ratios[1] * scale);
};
/**
 * Метод возвращает флаг - параллельны ли отрезки
 * @param  {Array} - массив крайних точек 1го и 2го отрезка вида [{x, y},{x, y}]
 * @returns {Boolean} true - отрезки параллельны, false - не параллельны
 */
export const isFragmentsParallel = ([pnt1, pnt2], [pnt3, pnt4]) => {
  const fragment1 = fragmentData([pnt1, pnt2]),
    fragment2 = fragmentData([pnt3, pnt4]),
    epsilon = 0.000001, //точность совпадения величин
    isEqualNormVectorX = Math.abs(fragment1.nx - fragment2.nx) < epsilon,
    isEqualNormVectorY = Math.abs(fragment1.ny - fragment2.ny) < epsilon;
  return isEqualNormVectorX && isEqualNormVectorY;
};
/**
 * Метод возвращает флаг - равны ли длины отрезков
 * @param {Array} fragment0 - массив точек 1го отрезка вида [{x, y}, {x, y}]
 * @param {Array} fragment1 - массив точек 2го отрезка вида [{x, y}, {x, y}]
 * @returns {Boolean} true - длины отрезков равны, false - не равны
 */
export const isFragmentsLengthsEqual = (fragment0, fragment1) => {
  return lineLength(fragment0) === lineLength(fragment1);
};
/**
 * Метод возвращает площадь прямоугольника, заданного двумя смежными отрезками
 * @param {Array} fragment0 - 1я сторона прямоугольника вида [{x, y}, {x, y}]
 * @param {Array} fragment1 - 2я сторона прямоугольника вида [{x, y}, {x, y}]
 * @returns {Number} площадь прямоугольника
 */
export const rectangleSquare = (fragment0, fragment1) => {
  return lineLength(fragment0) * lineLength(fragment1);
};
/**
 * Метод возвращает крайние координаты из набора точек
 * @param {Array} pnts набор точек вида [{x, y}]
 * @param {Boolean} isCross true - набор координат для крестика, который занимает одну клетку, false - набор координат для точки на узле сетки
 * @returns {Object} {minX, minY, maxX, maxY}
 */
export const extremumPoints = (pnts, isCross) => {
  const minX = Number.MAX_VALUE,
    minY = Number.MAX_VALUE,
    maxX = Number.MIN_VALUE,
    maxY = Number.MIN_VALUE;
  return pnts.reduce(
    (acc, pnt) => {
      acc.minX = Math.min(acc.minX, pnt.x);
      acc.maxX = Math.max(acc.maxX, isCross ? pnt.x + 1 : pnt.x);
      acc.minY = Math.min(acc.minY, pnt.y);
      acc.maxY = Math.max(acc.maxY, isCross ? pnt.y + 1 : pnt.y);
      return acc;
    },
    { minX, minY, maxX, maxY }
  );
};
/**
 * Метод возвращает массив данных пересечения линии line со сторонами фигуры, заданной точками pnts
 * @param {Array} line - массив двух точек линии [{x, y}, {x, y}]
 * @param {Array} pnts - массив вершин фигуры [{x, y}, {x, y}, {x, y}, {x, y}]
 * @returns {Array} массив данных пересечения линии со сторонами фигуры вида[{
 *  side - сторона фигуры,
 *  cross - координаты точки пересечения линии или false, если пересечения нет
 *  ratio - соотношение отрезков стороны при пересечении ее линией или null, если пересечения нет
 * }]
 */
export const figureByPointsSidesCrossData = (line, pnts) => {
  return pnts.map((pnt, idx, arr) => {
    const fragment = [pnt, arr[idx === arr.length - 1 ? 0 : idx + 1]],
      cross = fragmentsCrossPoint(line, fragment),
      side = rectangleSideOrderedPoints(fragment),
      ratio = cross ? fragmentsRatio(side, cross) : null;
    return { side, cross, ratio };
  });
};
/**
 * Метод возвращает массив данных пересечения отрезка fragment с каждой стороной фигуры, заданной линиями lines,
 * @param {Array} fragment - массив линии вида [{x, y}, {x, y}]
 * @param {Array} lines - массив линий фигуры вида [[{x, y}, {x, y}],...]
 * @returns {Array} массив данных пересечения отрезка и сторон фигуры вида[{
 *  index - индекс стороны в массиве линий фигуры,
 *  side - сторона фигуры,
 *  cross - координаты точки пересечения линии и стороны или false, если пересечения нет
 *  isVertice - является ли точка пересечения вершиной
 *  uniqIndex
 *  - если точка пересечения совпадает с вершиной, то индекс вершины в наборе вершин фигуры
 *  - если точка пересечения не совпадает с вершиной, то минимальный индекс крайней точки стороны в наборе вершин фигуры
 * }]
 */
export const figureByLinesSidesCrossData = (fragment, lines) => {
  const figureVertices = linesUniqPoints(lines);
  return lines.map((line, index) => {
    const cross = fragmentsCrossPoint(line, fragment),
      side = rectangleSideOrderedPoints(line),
      isVertice = _.isEqual(side[0], cross) || _.isEqual(side[1], cross),
      uniqIndex = isVertice
        ? figureVertices.findIndex(uniqPoint => _.isEqual(uniqPoint, cross))
        : index === lines.length - 1
        ? index
        : side.reduce((accum, pnt) => {
            return Math.min(
              accum,
              figureVertices.findIndex(uniqPoint => _.isEqual(pnt, uniqPoint))
            );
          }, Number.MAX_VALUE);
    return { index, side, cross, uniqIndex, isVertice };
  });
};
/**
 * Метод возвращает данные по каждому отрезку ломаной линии polyline, который пересекается со стороной фигуры, заданной линиями lines,
 * @param {Array} polyline - массив точек ломаной линии вида [{x, y}, {x, y}]
 * @param {Array} lines - массив сторон фигуры вида [[{x, y}, {x, y}],...]
 * @returns {Array} массив данных пересечения ломаной линии и сторон фигуры вида[{
 *  index - индекс стороны в массиве линий фигуры,
 *  side - сторона фигуры,
 *  cross - координаты точки пересечения линии и стороны
 *  start - начальный отрезок стороны фигуры, полученный пересечением с отрезком ломаной линиии
 *  end - конечный отрезок стороны фигуры, полученный пересечением с отрезком ломаной линиии
 *  uniqIndex
 *  - если точка пересечения совпадает с вершиной, то индекс вершины в наборе вершин фигуры
 *  - если точка пересечения не совпадает с вершиной, то минимальный индекс вершин стороны в наборе вершин фигуры
 * }]
 */
export const figureSidesCrossData = (polyline, lines) => {
  const crossData = _.flatten(
    polyline
      .map((pnt, pntIndex, arr) => {
        const fragment =
          pntIndex < arr.length - 1 ? [pnt, arr[pntIndex + 1]] : null;
        return (
          fragment &&
          figureByLinesSidesCrossData(fragment, lines).filter(pnt => pnt.cross)
        );
      })
      .filter(sideData => sideData && sideData.length)
      .map(sideData =>
        sideData.map(data => {
          const start = [data.side[0], data.cross],
            end = [data.cross, data.side[1]];
          return { ...data, start, end };
        })
      )
  );
  crossData.sort((data0, data1) => data0.uniqIndex - data1.uniqIndex);
  return crossData;
};
/**
 * Метод возвращает данные о сторонах прямоугольника, пересеченных линией
 * @param {Array} line - массив двух точек линии [{x, y}, {x, y}]
 * @param {Array} pnts - массив 4x точек вершин прямоугольника [{x, y}, {x, y}, {x, y}, {x, y}]
 * @returns {Array} массив объектов данных о пересеченных сторонах прямоугольника вида [{ side, cross, ratio }]
 *  side - сторона прямоугольника,
 *  cross - координаты точки пересечения стороны
 *  ratio - соотношение отрезков стороны при пересечении ее линией
 * 1. находим данные пересечения для каждой стороны прямоугольника
 * 2. извлекаем данные только пересеченных сторон
 */
export const crossPointsData = (line, pnts) => {
  const crossData = figureByPointsSidesCrossData(line, pnts);
  return crossData.filter(pnt => pnt.cross);
};
/**
 * Метод возвращает массив соотношений отрезков на двух пересеченных сторонах
 * @param {Array} line - массив точек линии вида [{x, y}, {x, y}]
 * @param {Array} pnts - массив вершин прямоугольника вида [{x, y}, {x, y}, {x, y}, {x, y}]
 * @returns {Array} массив двух чисел, если есть пересечение двух сторон, null - если двух пересечений нет
 * число - соотношение отрезков стороны, полученных пересечением
 * 0,Infinity - линия пересекает вершину прямоугольника, т.е. крайнюю точку стороны
 */
export const crossSidesFragmentsRatios = (line, pnts) => {
  const crossPoints = crossPointsData(line, pnts);
  return crossPoints.length === 2 ? crossPoints.map(pnt => pnt.ratio) : null;
};
/**
 * Метод возвращает данные о 1й стороне прямоугольника, пересеченной линией, если есть пересечение двух сторон
 * @param {Array} line - массив точек линии вида [{x, y}, {x, y}]
 * @param {Array} pnts - массив вершин прямоугольника вида [{x, y}, {x, y}, {x, y}, {x, y}]
 * @returns {Object} данные о пересеченной стороне прямоугольника вида { fragment0, fragment1, adjacentSide },
 * если есть пересечение двух сторон, null - если двух пересечений нет
 * fragment0 - 1й отрезок = от 1й точки стороны до точки пересечения = вида [{x, y}, {x, y}]
 * fragment1 - 2й отрезок = от точки пересечения до 2й точки стороны = вида [{x, y}, {x, y}]
 * adjacentSide - сторона прямоугольника смежная 1й стороне прямоугольника, пересеченной линией вида [{x, y}, {x, y}]
 */
export const checkFirstCrossSideData = (line, pnts) => {
  const crossData = figureByPointsSidesCrossData(line, pnts),
    crossPoints = crossData.filter(pnt => pnt.cross);
  return crossPoints.length === 2 ? firstCrossSideData(crossData) : null;
};
/**
 * Метод возвращает данные о 1й стороне прямоугольника, пересеченной линией
 * @param {Array} crossData - массив данных пересечения сторон прямоугольника вида [{ side, cross, ratio }]
 * @returns {Object} данные о пересеченной стороне прямоугольника вида { fragment0, fragment1, adjacentSide }
 * fragment0 - 1й отрезок = от 1й точки стороны до точки пересечения = вида [{x, y}, {x, y}]
 * fragment1 - 2й отрезок = от точки пересечения до 2й точки стороны = вида [{x, y}, {x, y}]
 * adjacentSide - сторона прямоугольника смежная 1й стороне прямоугольника, пересеченной линией вида [{x, y}, {x, y}]
 */
export const firstCrossSideData = crossData => {
  const firstCrossIndex = crossData.findIndex(pnt => pnt.cross),
    firstCrossData = crossData[firstCrossIndex],
    fragment0 = [firstCrossData.side[0], firstCrossData.cross],
    fragment1 = [firstCrossData.cross, firstCrossData.side[1]],
    adjacentSideIndex = firstCrossIndex
      ? firstCrossIndex - 1
      : firstCrossIndex + 1,
    adjacentSide = crossData[adjacentSideIndex].side;
  return { fragment0, fragment1, adjacentSide };
};
/**
 * Метод возвращает массив точек середин сторон прямоугольника
 * @param {Array} pnts - массив 4x точек вершин прямоугольника [{x, y}, {x, y}, {x, y}, {x, y}]
 * @returns {Array} [{x, y}, {x, y}, {x, y}, {x, y}]
 */
export const rectangleSidesMiddlePoints = pnts => {
  return pnts.map((pnt, idx, arr) => {
    const nextIndex = idx === arr.length - 1 ? 0 : idx + 1;
    return centerBetweenPoints(pnt, arr[nextIndex]);
  });
};
/**
 * Метод возвращает упорядоченный массив точек стороны прямоугольника
 * @param {Array} side - массив двух точек стороны [{x, y}, {x, y}]
 * @returns {Array} упорядоченный массив точек стороны прямоугольника: для горизонтали слева->направо, для вертикали - сверху->вниз
 */
export const rectangleSideOrderedPoints = side => {
  const extremums = extremumPoints(side);
  return [
    { x: extremums.minX, y: extremums.minY },
    { x: extremums.maxX, y: extremums.maxY },
  ];
};
/**
 * Метод возвращает флаг - пересекает ли линия только одну вершину прямоугольника
 * @param {Array} line - массив двух точек линии [{x, y}, {x, y}]
 * @param {Array} pnts - массив 4x точек вершин прямоугольника [{x, y}, {x, y}, {x, y}, {x, y}]
 * @returns {Boolean} true - линия пересекает только одну вершину прямоугольника, false - не пересекает
 */
export const isLineCrossRectangleOneVertice = (line, pnts) => {
  return pnts.filter(pnt => isPointOnLine(pnt, line)).length === 1;
};
/**
 * Метод возвращает флаг - пересекает ли линия две противолежащие вершины прямоугольника
 * @param {Array} line - массив двух точек линии [{x, y}, {x, y}]
 * @param {Array} pnts - массив 4x точек вершин прямоугольника [{x, y}, {x, y}, {x, y}, {x, y}]
 * @returns {Boolean} true - линия пересекает противолежащие вершины прямоугольника, false - не пересекает
 */
export const isLineCrossRectangleOppositeVertices = (line, pnts) => {
  return (
    (isPointOnLine(pnts[0], line) && isPointOnLine(pnts[2], line)) ||
    (isPointOnLine(pnts[1], line) && isPointOnLine(pnts[3], line))
  );
};
/**
 * Метод возвращает флаг - пересекает ли линия две противолежащие стороны прямоугольника
 * @param {Array} line - массив точек линии вида [{x, y}, {x, y}]
 * @param {Array} pnts- массив вершин прямоугольник вида [{x, y}, {x, y}, {x, y}, {x, y}]
 * @returns {Boolean} true - линия пересекает две противолежащие стороны прямоугольника, false - не пересекает
 */
export const isLineCrossRectangleOppositeSides = (line, pnts) => {
  const crossData = figureByPointsSidesCrossData(line, pnts),
    crossPoints = crossData.filter(pnt => pnt.cross),
    isVertical = !!crossData[0].cross && !!crossData[2].cross,
    isHorizontal = !!crossData[1].cross && !!crossData[3].cross;
  return crossPoints.length === 2 && (isVertical || isHorizontal);
};
/**
 * Метод возвращает флаг - пересекает ли линия две смежные стороны прямоугольника
 * @param {Array} line - массив точек линии вида [{x, y}, {x, y}]
 * @param {Array} pnts- массив вершин прямоугольник вида [{x, y}, {x, y}, {x, y}, {x, y}]
 * @returns {Boolean} true - линия пересекает две смежные стороны прямоугольника, false - не пересекает
 */
export const isLineCrossRectangleAdjacentSides = (line, pnts) => {
  const crossData = figureByPointsSidesCrossData(line, pnts),
    crossPoints = crossData.filter(pnt => pnt.cross),
    isVertical = !!crossData[0].cross && !!crossData[2].cross,
    isHorizontal = !!crossData[1].cross && !!crossData[3].cross;
  return crossPoints.length === 2 && !(isVertical || isHorizontal);
};
