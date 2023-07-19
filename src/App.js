import './App.css';
import React, { useEffect, useState } from 'react';
import axios from 'axios';

const apiKey = 'test_e97698c52a1e7a6f0942376e913c0f'; // Test
// const apiKey = 'live_877ae01954fbe635f34896b127f4fd'; // Live

function App() {
  const [campeonatos, setCampeonatos] = useState([]);
  const [selectedCampeonato, setSelectedCampeonato] = useState('');
  const [tabelaCampeonato, setTabelaCampeonato] = useState([]);
  const [statusTabela, setStatusTabela] = useState(false);
  const [responseStatusCode, setResponseStatusCode] = useState('');
  const [responseMessage, setResponseMessage] = useState('');
  const dropdownDefault = "Selecione o campeonato";

  useEffect(() => {
    axios.get('https://api.api-futebol.com.br/v1/campeonatos/', {
      headers: {
        'Authorization': `Bearer ${apiKey}`
      }
    })
      .then(response => {
        setCampeonatos(response.data);
      })
      .catch(error => {
        if (error.response) {
          setResponseStatusCode(error.response.data.code);
          setResponseMessage(error.response.data.message);
          console.error('Erro ao obter os dados da API:', error.response.data.message);
        } else {
          console.error('Erro ao obter os dados da API:', error.message);
        }
      });
  }, []);

  const atualizaStatusTabela = () => {
    setStatusTabela(!statusTabela);
    setSelectedCampeonato(dropdownDefault);
    setTabelaCampeonato([]);
  };

  const atualizaStatus = (valor) => {
    setSelectedCampeonato(valor);
    setResponseStatusCode('');
    setResponseMessage('');

    if (valor !== dropdownDefault) {
      const campeonatoSelecionado = campeonatos.find(campeonato => campeonato.nome === valor);
      if (campeonatoSelecionado) {
        const campeonatoId = campeonatoSelecionado.campeonato_id;
        axios.get(`https://api.api-futebol.com.br/v1/campeonatos/${campeonatoId}/tabela`, {
          headers: {
            'Authorization': `Bearer ${apiKey}`
          }
        })
          .then(response => {
            setTabelaCampeonato(response.data);
            setResponseStatusCode(response.status);
            if (response.status == 200) {
              setStatusTabela(true);
            }
          })
          .catch(error => {
            setStatusTabela(false);
            if (error.response) {
              setResponseStatusCode(error.response.data.code);
              setResponseMessage(error.response.data.message);
              console.error('Erro ao obter os dados da API:', error.response.data.message);
            } else {
              console.error('Erro ao obter os dados da API:', error.message);
            }
          });
      }
    }

    if (valor !== '' && valor !== dropdownDefault) {
      setStatusTabela(!statusTabela);
    }

  }

  const exibeTabelaDoCampeonato = () => {

    return <div>
      <h2>{selectedCampeonato}</h2>
      {/* Tabela do campeonato */}
      <table>
        <thead>
          <tr>
            <th>Posição</th>
            <th>Time</th>
            <th>Aproveitamento</th>
            <th>Derrotas</th>
            <th>Empates</th>
            <th>Gols contra</th>
            <th>Gols pro</th>
            <th>Jogos</th>
            <th>Pontos</th>
            <th>Posição</th>
            <th>Saldo gols</th>
            <th>Vitorias</th>
          </tr>
        </thead>
        <tbody>
          {tabelaCampeonato.map((time, index) => (
            <tr key={time.time_id}>
              <td>{index + 1}</td>
              <td>{time.time.nome_popular}</td>
              <th>{time.aproveitamento}</th>
              <td>{time.derrotas}</td>
              <td>{time.empates}</td>
              <td>{time.gols_contra}</td>
              <td>{time.gols_pro}</td>
              <td>{time.jogos}</td>
              <td>{time.pontos}</td>
              <td>{time.posicao}</td>
              <td>{time.saldo_gols}</td>
              <td>{time.vitorias}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div style={{ height: "50px" }}></div>

      <div className="div-botao">
        <button className="botao-style" onClick={atualizaStatusTabela}>
          Voltar
        </button>
      </div>
    </div>
  }

  const exibeDropdown = () => {

    return <div>
      <select value={selectedCampeonato} onChange={(e) => atualizaStatus(e.target.value)}>
        <option value="">Selecione o campeonato</option>
        {campeonatos.map(campeonato => (
          <option key={campeonato.campeonato_id} value={campeonato.nome}>
            {campeonato.nome}
          </option>
        ))}
      </select>

      {responseStatusCode !== 200 ? (<h2>{responseMessage}</h2>) : (<div></div>)}
    </div>
  }

  return (
    <div>
      {/* Dropdown ou Tabela */}
      {(
        statusTabela && tabelaCampeonato.length > 0
      ) ? (
        <div> {exibeTabelaDoCampeonato()} </div>
      ) : (
        <div> {exibeDropdown()} </div>
      )
      }
    </div>
  );
}

export default App;
