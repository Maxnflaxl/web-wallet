import React, { useEffect, useState } from 'react';
import { useStore } from 'effector-react';
import { styled } from '@linaria/react';

import {
  Window, Popup, Button, Footer,
} from '@uikit';
import { SeedConfirm } from '@pages/intro/seed';
import { View, setView } from '@app/model/view';
import { $ids, $seed, generateSeedFx } from '@app/model/base';

import EyeIcon from '@icons/icon-eye.svg';
import PassIcon from '@icons/icon-pass.svg';
import CopyIcon from '@icons/icon-copy.svg';
import DoneIcon from '@icons/icon-done.svg';
import LockIcon from '@icons/icon-lock.svg';
import ArrowIcon from '@icons/icon-arrow.svg';

const WarningListStyled = styled.ul`
  > li {
    position: relative;
    height: 34px;
    line-height: 34px;
    margin-bottom: 20px;
    padding-left: 60px;
    text-align: left;
  }

  svg {
    position: absolute;
    top: 50%;
    left: 0;
    transform: translateY(-50%);
  }

  p {
    display: inline-block;
    vertical-align: middle;
    line-height: normal;
    margin: 0;
  }
`;

const SeedListStyled = styled.ol`
  counter-reset: counter;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  padding: 0 10px;

  > li {
    counter-increment: counter;
    display: inline-block;
    width: 140px;
    height: 32px;
    line-height: 30px;
    margin-bottom: 10px;
    border: 1px solid rgba(255, 255, 255, 0.2);
    border-radius: 16px;
    text-align: left;

    &:before {
      display: inline-block;
      content: counter(counter);
      width: 20px;
      height: 20px;
      line-height: 20px;
      margin: 5px 10px 5px 9px;
      border-radius: 50%;
      background-color: rgba(255, 255, 255, 0.2);
      text-align: center;
      font-size: 10px;
      color: rgba(255, 255, 255, 0.5);
  }
`;

const Create = () => {
  const [step, setStep] = useState(0);
  const [warningVisible, toggleWarning] = useState(false);
  const seed = useStore($seed);
  const ids = useStore($ids);

  useEffect(() => {
    generateSeedFx();
  }, []);

  const handleSubmit: React.FormEventHandler = (event) => {
    event.preventDefault();
    setView(View.SET_PASSWORD);
  };

  const handleSkipClick: React.MouseEventHandler = () => {
    setView(View.SET_PASSWORD);
  };

  const handleNextClick: React.MouseEventHandler = () => {
    setStep(step + 1);
  };

  switch (step) {
    case 1: // write seed phrase
      return (
        <>
          <Window
            title="Seed phrase"
            blur={warningVisible}
          >
            <p>
              Your seed phrase is the access key to all the funds in your
              wallet. Print or write down the phrase to keep it in a safe or in
              a locked vault. Without the phrase you will not be able to recover
              your money.
            </p>
            <SeedListStyled>
              {seed.map((value, index) => (
                // eslint-disable-next-line
                <li key={index}>{value}</li>
              ))}
            </SeedListStyled>
            <Footer margin="small">
              <Button
                icon={LockIcon}
                type="button"
                onClick={() => toggleWarning(true)}
              >
                Complete verification
              </Button>
              <Button
                icon={ArrowIcon}
                type="button"
                variant="ghost"
                onClick={handleSkipClick}
              >
                I will do it later
              </Button>
            </Footer>
          </Window>
          <Popup
            visible={warningVisible}
            title="Save seed phrase"
            cancel="cancel"
            confirm="done"
            onCancel={() => {
              toggleWarning(false);
            }}
            onConfirm={handleNextClick}
          >
            Please write the seed phrase down. Storing it in a file makes it
            prone to cyber attacks and, therefore, less secure.
          </Popup>
        </>
      );
    case 2: // confirm seed phrase
      return (
        <Window title="Confirm seed phrase">
          <p>
            Your seed phrase is the access key to all the funds in your wallet.
            Print or write down the phrase to keep it in a safe or in a locked
            vault. Without the phrase you will not be able to recover your
            money.
          </p>
          <SeedConfirm seed={seed} ids={ids} onSubmit={handleSubmit} />
        </Window>
      );
    default:
      // warning
      return (
        <Window title="Create new wallet">
          <p>
            If you ever lose your device, you will need this phrase to recover
            your wallet!
            <br />
            {' '}
            Never type your seed phrase in keychains or password
            managers.
            <br />
            Never save it in your local or remote folders in any form.
          </p>
          <WarningListStyled>
            <li>
              <EyeIcon width={48} height={34} />
              <p>Do not let anyone see your seed phrase</p>
            </li>
            <li>
              <PassIcon width={48} height={34} />
              <p>
                Never type your seed phrase into password managers or elsewhere
              </p>
            </li>
            <li>
              <CopyIcon width={48} height={34} />
              <p>Make at least 2 copies of the phrase in case of emergency</p>
            </li>
          </WarningListStyled>
          <Footer>
            <Button icon={DoneIcon} type="button" onClick={handleNextClick}>
              I understand
            </Button>
          </Footer>
        </Window>
      );
  }
};

export default Create;
