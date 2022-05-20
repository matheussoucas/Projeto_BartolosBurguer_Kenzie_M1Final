
// variável modalKey sera global
let modalKey = 0

// variavel para controlar a quantidade inicial de Burguers na modal
let quantBurguers = 1

let cart = [] // carrinho


// funcoes auxiliares pra deixar o código melhor de ser trabalhado
const seleciona = (elemento) => document.querySelector(elemento)
const selecionaTodos = (elemento) => document.querySelectorAll(elemento)

const formatoReal = (valor) => {
    return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}

const formatoMonetario = (valor) => {
    if(valor) {
        return valor.toFixed(2)
    }
}

// aki uma pequena estilização
const abrirModal = () => {
    seleciona('.BurguerWindowArea').style.opacity = 0 // transparente
    seleciona('.BurguerWindowArea').style.display = 'flex'
    setTimeout(() => seleciona('.BurguerWindowArea').style.opacity = 1, 150)
}

const fecharModal = () => {
    seleciona('.BurguerWindowArea').style.opacity = 0 // transparente
    setTimeout(() => seleciona('.BurguerWindowArea').style.display = 'none', 500)
}

// aki criei um botão pra cancelar o modal, em versão mobile tambem 
const botoesFechar = () => {
    // BOTOES FECHAR MODAL
    selecionaTodos('.BurguerInfo--cancelButton, .BurguerInfo--cancelMobileButton').forEach( (item) => item.addEventListener('click', fecharModal) )
}

const preencheDadosDasBurguers = (BurguerItem, item, index) => {
    
    // setei um atributo para identificar qual elemento foi clicado
	BurguerItem.setAttribute('data-key', index)
    BurguerItem.querySelector('.Burguer-item--img img').src = item.img
    BurguerItem.querySelector('.Burguer-item--price').innerHTML = formatoReal(item.price[2])
    BurguerItem.querySelector('.Burguer-item--name').innerHTML = item.name
    BurguerItem.querySelector('.Burguer-item--desc').innerHTML = item.description
}

const preencheDadosModal = (item) => {
    seleciona('.BurguerBig img').src = item.img
    seleciona('.BurguerInfo h1').innerHTML = item.name
    seleciona('.BurguerInfo--desc').innerHTML = item.description
    seleciona('.BurguerInfo--actualPrice').innerHTML = formatoReal(item.price[2])
}


const pegarKey = (e) => {
    // .closest retorna o elemento mais proximo que tem a class que foi passada
    // do .Burguer-item ele vai pegar o valor do atributo data-key
    let key = e.target.closest('.Burguer-item').getAttribute('data-key')
    
    // garantir que a quantidade inicial de Burguers é 1
    quantBurguers = 1

    // Para manter a informação de qual Burguer foi clicada
    modalKey = key

    return key
}

const preencherTamanhos = (key) => {
    // tirar a selecao de tamanho atual e selecionar o tamanho grande
    seleciona('.BurguerInfo--size.selected').classList.remove('selected')

    // selecionar todos os tamanhos
    selecionaTodos('.BurguerInfo--size').forEach((size, sizeIndex) => {
        // selecionar o tamanho grande
        (sizeIndex == 2) ? size.classList.add('selected') : ''
        size.querySelector('span').innerHTML = bartolo[key].sizes[sizeIndex]
    })
}

const escolherTamanhoPreco = (key) => {
    // Ações nos botões de tamanho
    // selecionar todos os tamanhos
    selecionaTodos('.BurguerInfo--size').forEach((size, sizeIndex) => {
        size.addEventListener('click', (e) => {
            // clicou em um item, tirar a selecao dos outros e marca o q vc clicou
            // tirar a selecao de tamanho atual e selecionar o tamanho grande
            seleciona('.BurguerInfo--size.selected').classList.remove('selected')
            // marcar o que vc clicou
            size.classList.add('selected')

            // mudar o preço de acordo com o tamanho
            seleciona('.BurguerInfo--actualPrice').innerHTML = formatoReal(bartolo[key].price[sizeIndex])
        })
    })
}

const mudarQuantidade = () => {
    // Ações nos botões + e - da janela modal
    seleciona('.BurguerInfo--qtmais').addEventListener('click', () => {
        quantBurguers++
        seleciona('.BurguerInfo--qt').innerHTML = quantBurguers
    })

    seleciona('.BurguerInfo--qtmenos').addEventListener('click', () => {
        if(quantBurguers > 1) {
            quantBurguers--
            seleciona('.BurguerInfo--qt').innerHTML = quantBurguers	
        }
    })
}

const adicionarNoCarrinho = () => {
    seleciona('.BurguerInfo--addButton').addEventListener('click', () => {
        console.log('Adicionar no carrinho')

        // pegar dados da janela modal atual
    	// qual Burguer? pegue o modalKey para usar BurguerJson[modalKey]
    	console.log("Burguer " + modalKey)
    	// tamanho
	    let size = seleciona('.BurguerInfo--size.selected').getAttribute('data-key')
	    console.log("Tamanho " + size)
	    // quantidade
    	console.log("Quant. " + quantBurguers)
        // preco
        let price = seleciona('.BurguerInfo--actualPrice').innerHTML.replace('R$&nbsp;', '')
    
        // crie um identificador que junte id e tamanho
	    // concatene as duas informacoes separadas por um símbolo, vc escolhe
	    let identificador = bartolo[modalKey].id+'t'+size

        // antes de adicionar verifique se ja tem aquele codigo e tamanho
        // para adicionarmos a quantidade
        let key = cart.findIndex( (item) => item.identificador == identificador )
        console.log(key)

        if(key > -1) {
            // se encontrar aumente a quantidade
            cart[key].qt += quantBurguers
        } else {
            // adicionar objeto Burguer no carrinho
            let Burguer = {
                identificador,
                id: bartolo[modalKey].id,
                size, // size: size
                qt: quantBurguers,
                price: parseFloat(price) // price: price
            }
            cart.push(Burguer)
            console.log(Burguer)
            console.log('Sub total R$ ' + (Burguer.qt * Burguer.price).toFixed(2))
        }

        fecharModal()
        abrirCarrinho()
        atualizarCarrinho()
    })
}

const abrirCarrinho = () => {
    console.log('Qtd de itens no carrinho ' + cart.length)
    if(cart.length > 0) {
        // mostrar o carrinho
	    seleciona('aside').classList.add('show')
        seleciona('header').style.display = 'flex' // mostrar barra superior
    }

    // exibir aside do carrinho no modo mobile
    seleciona('.menu-openner').addEventListener('click', () => {
        if(cart.length > 0) {
            seleciona('aside').classList.add('show')
            seleciona('aside').style.left = '0'
        }
    })
}

const fecharCarrinho = () => {
    // fechar o carrinho com o botão X no modo mobile
    seleciona('.menu-closer').addEventListener('click', () => {
        seleciona('aside').style.left = '100vw' // usando 100vw ele ficara fora da tela
        seleciona('header').style.display = 'flex'
    })
}

const atualizarCarrinho = () => {
    // exibir número de itens no carrinho
	seleciona('.menu-openner span').innerHTML = cart.length
	
	// mostrar ou nao o carrinho
	if(cart.length > 0) {

		// mostra o carrinho
		seleciona('aside').classList.add('show')

		// zerar meu .cart para nao fazer insercoes duplicadas
		seleciona('.cart').innerHTML = ''

        // variaveis antes do for
		let subtotal = 0
		let desconto = 0
		let total    = 0

        // para preencher os itens do carrinho, calcular subtotal
		for(let i in cart) {
			// use o find para pegar o item por id
			let BurguerItem = bartolo.find( (item) => item.id == cart[i].id )
			console.log(BurguerItem)

            // em cada item pegar o subtotal
        	subtotal += cart[i].price * cart[i].qt
            //console.log(cart[i].price)

			// fazer o clone, exibir na telas e depois preencher as informacoes
			let cartItem = seleciona('.models .cart--item').cloneNode(true)
			seleciona('.cart').append(cartItem)

			let BurguerSizeName = cart[i].size

			let BurguerName = `${BurguerItem.name} (${BurguerSizeName})`

			// preencher as informacoes
			cartItem.querySelector('img').src = BurguerItem.img
			cartItem.querySelector('.cart--item-nome').innerHTML = BurguerName
			cartItem.querySelector('.cart--item--qt').innerHTML = cart[i].qt

			// selecionar botoes + e -
			cartItem.querySelector('.cart--item-qtmais').addEventListener('click', () => {
				console.log('Clicou no botão mais')
				// adicionar apenas a quantidade que esta neste contexto
				cart[i].qt++
				// atualizar a quantidade
				atualizarCarrinho()
			})

			cartItem.querySelector('.cart--item-qtmenos').addEventListener('click', () => {
				console.log('Clicou no botão menos')
				if(cart[i].qt > 1) {
					// subtrair apenas a quantidade que esta neste contexto
					cart[i].qt--
				} else {
					// remover se for zero
					cart.splice(i, 1)
				}

                (cart.length < 1) ? seleciona('header').style.display = 'flex' : ''

				// atualizar a quantidade
				atualizarCarrinho()
			})

			seleciona('.cart').append(cartItem)

		} // fim do for

		// fora do for
		// calcule desconto 10% e total
		//desconto = subtotal * 0.1
		desconto = subtotal * 0
		total = subtotal - desconto

		// exibir na tela os resultados
		// selecionar o ultimo span do elemento
		seleciona('.subtotal span:last-child').innerHTML = formatoReal(subtotal)
		seleciona('.desconto span:last-child').innerHTML = formatoReal(desconto)
		seleciona('.total span:last-child').innerHTML    = formatoReal(total)

	} else {
		// ocultar o carrinho
		seleciona('aside').classList.remove('show')
		seleciona('aside').style.left = '100vw'
	}
}

const finalizarCompra = () => {
    seleciona('.cart--finalizar').addEventListener('click', () => {
        console.log('Finalizar compra')
        seleciona('aside').classList.remove('show')
        seleciona('aside').style.left = '100vw'
        seleciona('header').style.display = 'flex'
    })
}



// MAPEAR BurguerJson para gerar lista de Burguers
bartolo.map((item, index ) => {
    //console.log(item)
    let BurguerItem = document.querySelector('.models .Burguer-item').cloneNode(true)
    //console.log(BurguerItem)
    //document.querySelector('.Burguer-area').append(BurguerItem)
    seleciona('.Burguer-area').append(BurguerItem)

    // preencher os dados de cada Burguer
    preencheDadosDasBurguers(BurguerItem, item, index)
    
    // Burguer clicada
    BurguerItem.querySelector('.Burguer-item a').addEventListener('click', (e) => {
        e.preventDefault()
        console.log('Clicou na Burguer')

        
        let chave = pegarKey(e)
        

        // abrir janela modal
        abrirModal()

        // preenchimento dos dados
        preencheDadosModal(item)

        /
        // pegar tamanho selecionado
        preencherTamanhos(chave)

		// definir quantidade inicial como 1
		seleciona('.BurguerInfo--qt').innerHTML = quantBurguers

        // selecionar o tamanho e preco com o clique no botao
        escolherTamanhoPreco(chave)
        

    })

    botoesFechar()

}) //MAPEAR bartolo para gerar lista de Burguers


// mudar quantidade com os botoes + e -
mudarQuantidade()



adicionarNoCarrinho()
atualizarCarrinho()
fecharCarrinho()
finalizarCompra()

