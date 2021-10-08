import React, {
  ReactElement, useEffect, useRef, useState,
} from 'react';
import { styled } from '@linaria/react';
import { isNil } from '@core/utils';

import { css } from '@linaria/core';
import Angle from './Angle';

const ContainerStyled = styled.div`
  display: inline-block;
  position: relative;
  margin-left: 10px;
`;

const SelectStyled = styled.div`
  position: absolute;
  top: 100%;
  right: 0;
  z-index: 1;
  margin-top: 8px;
  padding: 10px 0;
  border-radius: 10px;
  background-color: var(--color-select);
`;

const OptionStyled = styled.div`
  padding: 10px 20px;
  cursor: pointer;
  text-align: left;
  white-space: nowrap;

  &:hover,
  &:active {
    background-color: rgba(255, 255, 255, 0.07);
  }
`;

const OptionActiveStyled = styled(OptionStyled)`
  cursor: default;
  color: var(--color-green);

  &:hover,
  &:active {
    background-color: transparent;
  }
`;

const ButtonStyled = styled.button`
  cursor: pointer;
  border: none;
  background-color: transparent;
  text-decoration: none;
  color: white;
  white-space: nowrap;

  &:hover, &:active {
    background-color: transparent;
  }
`;

const angleStyle = css`
  margin-left: 8px;
`;

interface OptionProps {
  // eslint-disable-next-line
  value: any;
  active?: boolean;
}

export const Option: React.FC<OptionProps> = ({
  active,
  children,
}) => {
  if (active) {
    return (
      <OptionActiveStyled>
        {children}
      </OptionActiveStyled>
    );
  }

  return (
    <OptionStyled>
      {children}
    </OptionStyled>
  );
};

interface SelectProps<T = any> {
  value: T;
  className?: string;
  onSelect: (value: T) => void;
}

export const Select: React.FC<SelectProps> = ({
  value,
  className,
  children,
  onSelect,
}) => {
  const [opened, setOpened] = useState(false);
  const selectRef = useRef<HTMLDivElement>();

  useEffect(() => {
    if (opened) {
      const { current } = selectRef;
      if (!isNil(current)) {
        current.focus();
      }
    }
  }, [opened]);

  const handleMouseDown = () => {
    setOpened(!opened);
  };

  const handleBlur = () => {
    setOpened(false);
  };

  const array = React.Children.toArray(children);

  const options = array.map(
    (child) => {
      const { value: next } = (child as React.ReactElement).props;
      const active = value === next;

      const handleClick: React.MouseEventHandler<HTMLElement> = (event) => {
        if (active) {
          event.preventDefault();
          return;
        }

        onSelect(next);
      };

      return React.cloneElement(child as React.ReactElement, {
        active,
        onClick: handleClick,
      });
    },
  );

  const selected = array.find((child) => {
    const { value: current } = (child as ReactElement).props;
    return value === current;
  });

  return (
    <ContainerStyled className={className}>
      <ButtonStyled type="button" onMouseDown={handleMouseDown}>
        { (selected as ReactElement).props.children }
        <Angle className={angleStyle} value={opened ? 180 : 90} margin={opened ? 3 : 1} />
      </ButtonStyled>
      {opened && (
        <SelectStyled ref={selectRef} tabIndex={-1} onBlur={handleBlur}>
          { options }
        </SelectStyled>
      )}
    </ContainerStyled>
  );
};

export default Select;
