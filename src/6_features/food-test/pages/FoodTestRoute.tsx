import { useParams } from 'react-router-dom';
import { getExperiment } from '../experiments';
import { FoodTestPage } from './FoodTestPage';

/** Picks the experiment from the URL, e.g. /food-test/reducing-sugar. */
export function FoodTestRoute() {
  const { testId } = useParams();
  const experiment = testId ? getExperiment(testId) : undefined;

  if (!experiment) {
    return (
      <div className="grid min-h-dvh place-items-center bg-background px-6 text-center text-foreground">
        <div>
          <h1 className="text-2xl font-bold">Test not found</h1>
          <p className="mt-2 text-soft">That food test does not exist. Go back and choose one from Learn.</p>
        </div>
      </div>
    );
  }

  return <FoodTestPage experiment={experiment} />;
}