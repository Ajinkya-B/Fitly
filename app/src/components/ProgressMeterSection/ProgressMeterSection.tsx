import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from '@/components/ui/carousel';
import { Card, CardContent } from '@/components/ui/card';
import {
  WeightChart,
  CalorieIntakeChart,
  LiftVolumeChart,
  ExerciseWeightChart,
} from './Charts';

export const ProgressMeterSection = () => {
  return (
    <div className="flex flex-col gap-6 px-3">
      {/* First Carousel: Nutrition + Body */}
      <div className="relative w-full">
        <Carousel className="w-full">
          <CarouselContent className="px-2 sm:px-4 md:px-8">
            {/* leave space for arrows */}
            <CarouselItem className="basis-full w-full">
              <Card>
                <CardContent className="p-4">
                  <h3 className="text-base font-medium mb-2">User Weight</h3>
                  <div className="w-full h-[200px] sm:h-[250px]">
                    <WeightChart />
                  </div>
                </CardContent>
              </Card>
            </CarouselItem>
            <CarouselItem className="basis-full w-full">
              <Card>
                <CardContent className="p-4">
                  <h3 className="text-base font-medium mb-2">Calorie Intake</h3>
                  <div className="w-full h-[200px] sm:h-[250px]">
                    <CalorieIntakeChart />
                  </div>
                </CardContent>
              </Card>
            </CarouselItem>
          </CarouselContent>
          {/* Responsive arrow positions */}
          <CarouselPrevious className="absolute left-0 sm:-left-4 top-1/2 -translate-y-1/2 z-10" />
          <CarouselNext className="absolute right-0 sm:-right-4 top-1/2 -translate-y-1/2 z-10" />
        </Carousel>
      </div>

      {/* Second Carousel: Lifting */}
      <div className="relative w-full">
        <Carousel className="w-full">
          <CarouselContent className="px-2 sm:px-4 md:px-8">
            <CarouselItem className="basis-full w-full">
              <Card>
                <CardContent className="p-4">
                  <h3 className="text-base font-medium mb-2">
                    Total Lifted Volume
                  </h3>
                  <div className="w-full h-[200px] sm:h-[250px]">
                    <LiftVolumeChart />
                  </div>
                </CardContent>
              </Card>
            </CarouselItem>
            <CarouselItem className="basis-full w-full">
              <Card>
                <CardContent className="p-4">
                  <h3 className="text-base font-medium mb-2">
                    Weight per Exercise
                  </h3>
                  <div className="w-full h-[200px] sm:h-[250px]">
                    <ExerciseWeightChart />
                  </div>
                </CardContent>
              </Card>
            </CarouselItem>
          </CarouselContent>

          {/* Responsive arrow positions */}
          <CarouselPrevious className="absolute left-0 sm:-left-4 top-1/2 -translate-y-1/2 z-10" />
          <CarouselNext className="absolute right-0 sm:-right-4 top-1/2 -translate-y-1/2 z-10" />
        </Carousel>
      </div>
    </div>
  );
};
