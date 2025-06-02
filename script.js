const API_URL = "http://cnms-parking-api.net.uztec.com.br/api/v1";


function carregarVeiculos() {
  const imagem = document.getElementById("imagemcat");
  const veiculosDiv = document.getElementById("veiculosList");

  
  imagem.style.display = "none";
  veiculosDiv.style.display = "block";

  veiculosDiv.innerHTML = "<h3>Carregando veículos...</h3>";

  fetch(`${API_URL}/active`)
    .then(res => {
      if (!res.ok) throw new Error("Falha ao carregar veículos.");
      return res.json();
    })
    .then(veiculos => {
      if (veiculos.length === 0) {
        veiculosDiv.innerHTML = "<h3>Veículos Estacionados:</h3><p>Nenhum veículo ativo no momento.</p>";
        return;
      }

      veiculosDiv.innerHTML = "<h3>Veículos Estacionados:</h3>";
      veiculos.forEach(v => {
        const div = document.createElement("div");
        div.textContent = `Placa: ${v.plate} | Modelo: ${v.model || 'Desconhecido'}`;
        veiculosDiv.appendChild(div);
      });
    })
    .catch(err => {
      veiculosDiv.innerHTML = `<p style="color:red;">Erro: ${err.message}</p>`;
      console.error("Erro ao carregar veículos:", err);
    });
}


function voltarImagem() {
  document.getElementById("imagemcat").style.display = "block";
  document.getElementById("veiculosList").style.display = "none";
}


function verificarVeiculo() {
  const placa = prompt("Digite a placa:");
  if (!placa) return;

  fetch(`${API_URL}/check/${placa}`)
    .then(res => {
      if (!res.ok) throw new Error("Veículo não encontrado");
      return res.json();
    })
    .then(data => {
      alert(`Veículo ${data.plate} está no estacionamento desde: ${data.entryTime}`);
    })
    .catch(err => alert(err.message));
}


function cancelarVeiculo() {
  const placa = prompt("Digite a placa do veículo para cancelar:");
  if (!placa) return;

  fetch(`${API_URL}/cancel/${placa}`, { method: "DELETE" })
    .then(res => res.json())
    .then(data => {
      alert(data.message || "Veículo removido.");
      carregarVeiculos();
    })
    .catch(err => alert("Erro ao cancelar veículo."));
}


function registrarEntrada() {
  const placa = prompt("Digite a placa:");
  const modelo = prompt("Digite o modelo:");
  if (!placa || !modelo) return;

  fetch(`${API_URL}/entry`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ plate: placa, model: modelo })
  })
    .then(res => res.json())
    .then(data => {
      alert(data.message || "Veículo registrado.");
      carregarVeiculos();
    })
    .catch(err => alert("Erro ao registrar entrada."));
}


function registrarSaida() {
  const placa = prompt("Digite a placa do veículo que está saindo:");
  if (!placa) return;

  fetch(`${API_URL}/exit/${placa}`, {
    method: "PATCH"
  })
    .then(res => {
      if (!res.ok) throw new Error("Erro ao registrar saída");
      return res.json();
    })
    .then(data => {
      alert(`Veículo ${data.plate} saiu. Tempo estacionado: ${data.parkedTime.toFixed(2)} minutos`);
      carregarVeiculos();
    })
    .catch(err => alert(err.message));
}
