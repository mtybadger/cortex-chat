import * as Tabs from "./tabs";
import OnboardingCardTabs, { TabTitle } from "./components/OnboardingCardTabs";
import { XMarkIcon } from "@heroicons/react/24/outline";
import styled from "styled-components";
import { CloseButton, defaultBorderRadius, vscInputBackground } from "../";
import { getLocalStorage, setLocalStorage } from "../../util/localStorage";
import { useOnboardingCard } from "./hooks/useOnboardingCard";

const StyledCard = styled.div`
  margin: auto;
  border-radius: ${defaultBorderRadius};
  padding: 1rem 1.5rem;
  background-color: ${vscInputBackground};
  box-shadow: 0 20px 25px -5px rgb(0 0 0 / 0.1),
    0 8px 10px -6px rgb(0 0 0 / 0.1);
`;

export interface OnboardingCardState {
  show?: boolean;
  activeTab?: TabTitle;
}

export const defaultOnboardingCardState: OnboardingCardState = {
  show: false,
  activeTab: "Quickstart",
};

export type OnboardingCardProps = Pick<OnboardingCardState, "activeTab">;

function OnboardingCard(props: OnboardingCardProps) {
  const onboardingCard = useOnboardingCard();

  if (getLocalStorage("onboardingStatus") === undefined) {
    setLocalStorage("onboardingStatus", "Started");
  }

  return (
    <StyledCard className="relative">
      <Tabs.Quickstart />
    </StyledCard>
  );
}

export default OnboardingCard;
