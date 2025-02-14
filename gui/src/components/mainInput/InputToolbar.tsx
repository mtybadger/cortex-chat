import {
  PhotoIcon as OutlinePhotoIcon,
  PlusIcon,
} from "@heroicons/react/24/outline";
import { PhotoIcon as SolidPhotoIcon } from "@heroicons/react/24/solid";
import { InputModifiers } from "core";
import { RootState } from "../../redux/store";
import { modelSupportsImages } from "core/llm/autodetect";
import { useRef, useState } from "react";
import { useSelector } from "react-redux";
import styled from "styled-components";
import {
  defaultBorderRadius,
  lightGray,
  vscBadgeBackground,
  vscBadgeForeground,
  vscForeground,
  vscInputBackground,
} from "..";
import { selectUseActiveFile } from "../../redux/selectors";
import { defaultModelSelector } from "../../redux/selectors/modelSelectors";
import {
  getAltKeyLabel,
  getFontSize,
  getMetaKeyLabel,
  isMetaEquivalentKeyPressed,
} from "../../util";
import ModelSelect from "../modelSelection/ModelSelect";

const StyledDiv = styled.div<{ isHidden: boolean }>`
  padding: 4px 0;
  display: flex;
  justify-content: space-between;
  gap: 1px;
  background-color: ${vscInputBackground};
  align-items: center;
  font-size: ${getFontSize() - 2}px;
  cursor: ${(props) => (props.isHidden ? "default" : "text")};
  opacity: ${(props) => (props.isHidden ? 0 : 1)};
  pointer-events: ${(props) => (props.isHidden ? "none" : "auto")};

  & > * {
    flex: 0 0 auto;
  }

  /* Hide the "Use codebase" span first */
  @media (max-width: 450px) {
    & > span:last-child > span:nth-last-child(2) {
      display: none;
    }
  }
`;

const SecondToDisappearContainer = styled.span`
  display: flex;
  align-items: center;

  @media (max-width: 350px) {
    display: none;
  }
`;

const StyledSpan = styled.span`
  font-size: ${() => `${getFontSize() - 2}px`};
  color: ${lightGray};
`;

const EnterButton = styled.div<{ offFocus: boolean }>`
  padding: 2px 4px;
  display: flex;
  align-items: center;

  background-color: ${(props) =>
    props.offFocus ? undefined : lightGray + "33"};
  border-radius: ${defaultBorderRadius};
  color: ${vscForeground};

  &:hover {
    background-color: ${vscBadgeBackground};
    color: ${vscBadgeForeground};
  }

  cursor: pointer;
`;

interface InputToolbarProps {
  onEnter?: (modifiers: InputModifiers) => void;
  usingCodebase?: boolean;
  onAddContextItem?: () => void;

  onClick?: () => void;

  onImageFileSelected?: (file: File) => void;

  hidden?: boolean;
  showNoContext: boolean;
}

function InputToolbar(props: InputToolbarProps) {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const active = useSelector((store: RootState) => store.state.active);
  const [fileSelectHovered, setFileSelectHovered] = useState(false);

  const defaultModel = useSelector(defaultModelSelector);
  const useActiveFile = useSelector(selectUseActiveFile);

  return (
    <>
      <StyledDiv
        isHidden={props.hidden}
        onClick={props.onClick}
        id="input-toolbar"
      >
        <span className="flex gap-2 items-center whitespace-nowrap">
          <ModelSelect />

          {/* <SecondToDisappearContainer> */}
            {/* <StyledSpan
              onClick={(e) => {
                props.onAddContextItem();
              }}
              className="hover:underline cursor-pointer"
            >
              Add Context{" "}
              <PlusIcon className="h-2.5 w-2.5" aria-hidden="true" />
            </StyledSpan> */}
            {/* {defaultModel &&
              modelSupportsImages(
                defaultModel.provider,
                defaultModel.model,
                defaultModel.title,
                defaultModel.capabilities,
              ) && (
                <span
                  className="ml-1 -mb-0.5 cursor-pointer"
                  onMouseLeave={() => setFileSelectHovered(false)}
                  onMouseEnter={() => setFileSelectHovered(true)}
                >
                  <input
                    type="file"
                    ref={fileInputRef}
                    style={{ display: "none" }}
                    accept=".jpg,.jpeg,.png,.gif,.svg,.webp"
                    onChange={(e) => {
                      for (const file of e.target.files) {
                        props.onImageFileSelected(file);
                      }
                    }}
                  />
                  {fileSelectHovered ? (
                    <SolidPhotoIcon
                      width="1.4em"
                      height="1.4em"
                      color={lightGray}
                      onClick={(e) => {
                        fileInputRef.current?.click();
                      }}
                    />
                  ) : (
                    <OutlinePhotoIcon
                      width="1.4em"
                      height="1.4em"
                      color={lightGray}
                      onClick={(e) => {
                        fileInputRef.current?.click();
                      }}
                    />
                  )}
                </span>
              )}
          </SecondToDisappearContainer> */}
        </span>

        <span className="flex items-center gap-2 whitespace-nowrap">
          {/* {props.showNoContext ? (
            <span
              style={{
                color: props.usingCodebase ? vscBadgeBackground : lightGray,
                backgroundColor: props.usingCodebase
                  ? lightGray + "33"
                  : undefined,
                borderRadius: defaultBorderRadius,
                padding: "2px 4px",
              }}
            >
              {getAltKeyLabel()} ⏎{" "}
              {useActiveFile ? "No context" : "Use active file"}
            </span>
          ) : (
            <StyledSpan
              style={{
                color: props.usingCodebase ? vscBadgeBackground : lightGray,
                backgroundColor: props.usingCodebase
                  ? lightGray + "33"
                  : undefined,
                borderRadius: defaultBorderRadius,
                padding: "2px 4px",
              }}
              onClick={(e) => {
                props.onEnter({
                  useCodebase: true,
                  noContext: !useActiveFile,
                });
              }}
              className={"hover:underline cursor-pointer float-right"}
            >
              {getMetaKeyLabel()} ⏎ Use codebase
            </StyledSpan>
          )} */}

          {active ? (
            <StyledSpan>...</StyledSpan>
          ) : (
            <EnterButton
            offFocus={props.usingCodebase}
          onClick={(e) => {
            props.onEnter({
              // useCodebase: isMetaEquivalentKeyPressed(e),
              // noContext: useActiveFile ? e.altKey : !e.altKey,
              useCodebase: false,
              noContext: false,
            });
              }}
            >
              ⏎ Enter
            </EnterButton>
          )}
        </span>
      </StyledDiv>
    </>
  );
}

export default InputToolbar;
