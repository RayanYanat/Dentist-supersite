import AmbientCanvas from "@/components/shared/AmbientCanvas";
import GlobalTexture from "@/components/shared/GlobalTexture";
import CustomCursor  from "@/components/shared/CustomCursor";
import GSAPConfig    from "@/components/shared/GSAPConfig";
import LockedScreen  from "@/components/shared/LockedScreen";

/**
 * Root route — shown when a visitor reaches the bare domain without a
 * personalized slug (e.g. they've stripped the slug out of curiosity).
 *
 * Does NOT redirect to a demo slug — that would expose the template and
 * break the personalization illusion for every other prospect.
 */
export default function Home() {
  return (
    <>
      <AmbientCanvas />
      <GlobalTexture />
      <CustomCursor />
      <GSAPConfig />
      <LockedScreen />
    </>
  );
}
