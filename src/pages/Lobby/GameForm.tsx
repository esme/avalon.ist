// External

import React, { FormEvent } from 'react';
import { Redirect } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faTimes } from '@fortawesome/free-solid-svg-icons';

// Internal

import AvalonScrollbars from '../../components/utils/AvalonScrollbars';
import socket from '../../socket-io/socket-io';
import Slider from '../../components/utils/Slider';
import List from '../../components/utils/ListInput';

// Styles

import '../../styles/Utils/SettingsMenu.scss';

// Types

interface GameFormProps {
  title: string;
  onExit: (...args: any[]) => void;
  createsGame: boolean;
  initialRoleSettings?: {
    merlin: boolean;
    percival: boolean;
    morgana: boolean;
    assassin: boolean;
    oberon: boolean;
    mordred: boolean;
    card: boolean;
  };
  initialPlayerMax?: number;
}

interface GameFormState {
  showPlayerMax: boolean;
  playerMax: number;
  roleSettings: {
    merlin: boolean;
    percival: boolean;
    morgana: boolean;
    assassin: boolean;
    oberon: boolean;
    mordred: boolean;
    card: boolean;
  };
  redirect: boolean;
  processing: boolean;
  playerRoom: number;
}

// Declaration

class GameForm extends React.PureComponent<GameFormProps, GameFormState> {
  constructor(props: GameFormProps) {
    super(props);
    this.state = {
      showPlayerMax: false,
      playerMax: props.initialPlayerMax ? props.initialPlayerMax : 6,
      roleSettings: props.initialRoleSettings
        ? props.initialRoleSettings
        : {
            merlin: true,
            percival: true,
            morgana: true,
            assassin: true,
            oberon: false,
            mordred: false,
            card: false,
          },
      redirect: false,
      processing: false,
      playerRoom: -1,
    };
    this.createGameSuccess = this.createGameSuccess.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.sendCreateRequest = this.sendCreateRequest.bind(this);
    this.sendModifyRequest = this.sendModifyRequest.bind(this);
  }

  fabFour = {
    merlin: true,
    percival: true,
    morgana: true,
    assassin: true,
    oberon: false,
    mordred: false,
    card: false,
  };

  eightPlayers = {
    merlin: true,
    percival: true,
    morgana: true,
    assassin: true,
    oberon: false,
    mordred: false,
    card: true,
  };

  ninePlayers = {
    merlin: true,
    percival: true,
    morgana: true,
    assassin: true,
    oberon: false,
    mordred: true,
    card: true,
  };

  tenPlayers = {
    merlin: true,
    percival: true,
    morgana: true,
    assassin: true,
    oberon: true,
    mordred: true,
    card: true,
  };

  playerMaxList = [
    {
      text: '5',
      onClick: () =>
        this.setState({
          playerMax: 5,
          showPlayerMax: false,
          roleSettings: this.fabFour,
        }),
    },
    {
      text: '6',
      onClick: () =>
        this.setState({
          playerMax: 6,
          showPlayerMax: false,
          roleSettings: this.fabFour,
        }),
    },
    {
      text: '7',
      onClick: () =>
        this.setState({
          playerMax: 7,
          showPlayerMax: false,
          roleSettings: this.fabFour,
        }),
    },
    {
      text: '8',
      onClick: () =>
        this.setState({
          playerMax: 8,
          showPlayerMax: false,
          roleSettings: this.eightPlayers,
        }),
    },
    {
      text: '9',
      onClick: () =>
        this.setState({
          playerMax: 9,
          showPlayerMax: false,
          roleSettings: this.ninePlayers,
        }),
    },
    {
      text: '10',
      onClick: () =>
        this.setState({
          playerMax: 10,
          showPlayerMax: false,
          roleSettings: this.tenPlayers,
        }),
    },
  ];

  roleSwitchList = [
    () =>
      this.setState({
        roleSettings: {
          ...this.state.roleSettings,
          merlin: !this.state.roleSettings.merlin,
        },
      }),
    () =>
      this.setState({
        roleSettings: {
          ...this.state.roleSettings,
          percival: !this.state.roleSettings.percival,
        },
      }),
    () =>
      this.setState({
        roleSettings: {
          ...this.state.roleSettings,
          morgana: !this.state.roleSettings.morgana,
        },
      }),
    () =>
      this.setState({
        roleSettings: {
          ...this.state.roleSettings,
          assassin: !this.state.roleSettings.assassin,
        },
      }),
    () =>
      this.setState({
        roleSettings: {
          ...this.state.roleSettings,
          oberon: !this.state.roleSettings.oberon,
        },
      }),
    () =>
      this.setState({
        roleSettings: {
          ...this.state.roleSettings,
          mordred: !this.state.roleSettings.mordred,
        },
      }),
    () =>
      this.setState({
        roleSettings: {
          ...this.state.roleSettings,
          card: !this.state.roleSettings.card,
        },
      }),
  ];

  componentDidMount() {
    socket.on('createGameSuccess', this.createGameSuccess);
  }

  handleSubmit(event: FormEvent) {
    event.preventDefault();
    this.setState({ processing: true }, this.props.createsGame ? this.sendCreateRequest : this.sendModifyRequest);
  }

  createGameSuccess(data: number) {
    this.setState({
      processing: false,
      redirect: true,
      playerRoom: data,
    });
  }

  sendCreateRequest() {
    socket.emit('createGame', {
      roleSettings: this.state.roleSettings,
      maxPlayers: this.state.playerMax,
    });
  }

  sendModifyRequest() {
    socket.emit('editGame', {
      roleSettings: this.state.roleSettings,
      maxPlayers: this.state.playerMax,
    });

    this.props.onExit();
  }

  togglePlayerMax = () =>
    this.setState({
      showPlayerMax: !this.state.showPlayerMax,
    });

  render() {
    return (
      <div className="settings-form">
        {this.state.redirect ? <Redirect to={'/game/' + this.state.playerRoom} /> : null}
        <AvalonScrollbars>
        <form autoComplete="off" onSubmit={this.handleSubmit}>
          <p className="title">{this.props.title}</p>
          <div className="input-container">
            <p className="handle">Player Max</p>{' '}
            <List
              onClick={this.togglePlayerMax}
              show={this.state.showPlayerMax}
              title={this.state.playerMax.toString()}
              objects={this.playerMaxList}
            />
          </div>
          <p className="subtitle">Roles</p>
          <div className="input-container">
            <Slider value={this.state.roleSettings.merlin} onClick={this.roleSwitchList[0]} />
            <p className="handle">Merlin</p>
          </div>
          <div className="input-container">
            <Slider value={this.state.roleSettings.percival} onClick={this.roleSwitchList[1]} />
            <p className="handle">Percival</p>
          </div>
          <div className="input-container">
            <Slider value={this.state.roleSettings.morgana} onClick={this.roleSwitchList[2]} />
            <p className="handle">Morgana</p>
          </div>
          <div className="input-container">
            <Slider value={this.state.roleSettings.assassin} onClick={this.roleSwitchList[3]} />
            <p className="handle">Assassin</p>
          </div>
          <div className="input-container">
            <Slider value={this.state.roleSettings.oberon} onClick={this.roleSwitchList[4]} />
            <p className="handle">Oberon</p>
          </div>
          <div className="input-container">
            <Slider value={this.state.roleSettings.mordred} onClick={this.roleSwitchList[5]} />
            <p className="handle">Mordred</p>
          </div>
          <p className="subtitle">Cards</p>
          <div className="input-container">
            <Slider value={this.state.roleSettings.card} onClick={this.roleSwitchList[6]} />
            <p className="handle">Lady of the Lake</p>
          </div>
          {this.state.processing ? null : (
            <div className="buttons">
              <button className="bt-cancel" type="button" onClick={this.props.onExit}>
                <FontAwesomeIcon icon={faTimes} />
              </button>
              <button className="bt-accept" type="submit">
                <FontAwesomeIcon icon={faCheck} />
              </button>
            </div>
          )}
        </form>
        </AvalonScrollbars>
      </div>
    );
  }
}

export default GameForm;
