export default class FPSChecker {

    static framesCountForMeasure = 60;
    static oldCycleTime = 0;
    static cycleCount = 0;
    static fpsRate = 0;

    // Call on each new frame
    static update () {
        this.cycleCount++;
        if (this.cycleCount >= this.framesCountForMeasure) this.cycleCount = 0;
        const startTime = Date.now();
        const cycleTime = startTime - this.oldCycleTime;
        this.oldCycleTime = startTime;
        if (this.cycleCount % this.framesCountForMeasure == 0) {
            this.fpsRate = Math.floor(1000 / cycleTime);
        }
    }
}