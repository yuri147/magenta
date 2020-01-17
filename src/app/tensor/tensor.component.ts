import { Component, OnInit } from '@angular/core';
import * as tf from '@tensorflow/tfjs';

@Component({
  selector: 'app-tensor',
  templateUrl: './tensor.component.html',
  styleUrls: ['./tensor.component.scss']
})
export class TensorComponent implements OnInit {
  title = 'tensorApp';
  data: any;

  linearModel: tf.Sequential;

  /**
   * Get the car data reduced to just the variables we are interested
   * and cleaned of missing data.
   */
  async getData() {
    const carsDataReq = await fetch('https://storage.googleapis.com/tfjs-tutorials/carsData.json');
    const carsData = await carsDataReq.json();
    const cleaned = carsData
      .map(car => ({
        mpg: car.Miles_per_Gallon,
        horsepower: car.Horsepower
      }))
      .filter(car => car.mpg != null && car.horsepower != null);

    return cleaned;
  }

  async run() {
    // Load and plot the original input data that we are going to train on.
    this.data = await this.getData();
    const values = this.data.map(d => ({
      x: d.horsepower,
      y: d.mpg
    }));

    (window as any).tfvis.render.scatterplot(
      { name: 'Horsepower v MPG' },
      { values },
      {
        xLabel: 'Horsepower',
        yLabel: 'MPG',
        height: 300
      }
    );
  }

  createModel() {
    // Create a sequential model
    const model = tf.sequential();

    // Add a single hidden layer
    model.add(tf.layers.dense({ inputShape: [1], units: 1, useBias: true }));

    model.add(tf.layers.dense({ units: 50, activation: 'sigmoid' }));

    // Add an output layer
    model.add(tf.layers.dense({ units: 1, useBias: true }));

    return model;
  }

  convertToTensor(data) {
    // Wrapping these calculations in a tidy will dispose any
    // intermediate tensors.

    return tf.tidy(() => {
      // Step 1. Shuffle the data
      tf.util.shuffle(data);

      // Step 2. Convert data to Tensor
      const inputs = data.map(d => d.horsepower);
      const labels = data.map(d => d.mpg);

      const inputTensor = tf.tensor2d(inputs, [inputs.length, 1]);
      const labelTensor = tf.tensor2d(labels, [labels.length, 1]);

      // Step 3. Normalize the data to the range 0 - 1 using min-max scaling
      const inputMax = inputTensor.max();
      const inputMin = inputTensor.min();
      const labelMax = labelTensor.max();
      const labelMin = labelTensor.min();

      const normalizedInputs = inputTensor.sub(inputMin).div(inputMax.sub(inputMin));
      const normalizedLabels = labelTensor.sub(labelMin).div(labelMax.sub(labelMin));

      return {
        inputs: normalizedInputs,
        labels: normalizedLabels,
        // Return the min/max bounds so we can use them later.
        inputMax,
        inputMin,
        labelMax,
        labelMin
      };
    });
  }

  async trainModel(model, inputs, labels) {
    // Prepare the model for training.
    model.compile({
      optimizer: tf.train.adam(),
      loss: tf.losses.meanSquaredError,
      metrics: ['mse']
    });

    const batchSize = 32;
    const epochs = 50;

    return await model.fit(inputs, labels, {
      batchSize,
      epochs,
      shuffle: true,
      callbacks: (window as any).tfvis.show.fitCallbacks({ name: 'Training Performance' }, ['loss', 'mse'], {
        height: 200,
        callbacks: ['onEpochEnd']
      })
    });
  }

  testModel(model, inputData, normalizationData) {
    const { inputMax, inputMin, labelMin, labelMax } = normalizationData;

    // Generate predictions for a uniform range of numbers between 0 and 1;
    // We un-normalize the data by doing the inverse of the min-max scaling
    // that we did earlier.
    const [xs, preds] = tf.tidy(() => {
      const cxs = tf.linspace(0, 1, 100);
      const cpreds = model.predict(cxs.reshape([100, 1]));

      const unNormXs = cxs.mul(inputMax.sub(inputMin)).add(inputMin);

      const unNormPreds = cpreds.mul(labelMax.sub(labelMin)).add(labelMin);

      // Un-normalize the data
      return [unNormXs.dataSync(), unNormPreds.dataSync()];
    });

    const predictedPoints = Array.from(xs).map((val, i) => {
      return { x: val, y: preds[i] };
    });

    const originalPoints = inputData.map(d => ({
      x: d.horsepower,
      y: d.mpg
    }));

    (window as any).tfvis.render.scatterplot(
      { name: 'Model Predictions vs Original Data' },
      { values: [originalPoints, predictedPoints], series: ['original', 'predicted'] },
      {
        xLabel: 'Horsepower',
        yLabel: 'MPG',
        height: 300
      }
    );
  }

  async ngOnInit() {
    // Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    // Add 'implements OnInit' to the class.
    await this.run();

    const model = this.createModel();
    // (window as any).tfvis.show.modelSummary({ name: 'Model Summary' }, model);

    const tensorData = this.convertToTensor(this.data);
    const { inputs, labels } = tensorData;
    await this.trainModel(model, inputs, labels);
    console.log('Done Training');

    this.testModel(model, this.data, tensorData);
  }
}
