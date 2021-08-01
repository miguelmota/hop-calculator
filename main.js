// globals
const $amountIn = document.getElementById('amountIn')
const $ammFeeBps = document.getElementById('ammFeeBps')
const $ammFeePercent = document.getElementById('ammFeePercent')
const $bonderFeeBps = document.getElementById('bonderFeeBps')
const $bonderFeePercent = document.getElementById('bonderFeePercent')
const $slippageTolerance = document.getElementById('slippageTolerance')
const $slippageTolerancePercent = document.getElementById('slippageTolerancePercent')
const $decimals = document.getElementById('decimals')
const $deadlineMinutes = document.getElementById('deadlineMinutes')
const $form = document.getElementById('form')
const $output = document.getElementById('output')

const parseUnits = ethers.utils.parseUnits
const BigNumber = ethers.BigNumber

// functions

function updateBpsOutput ($input, $output) {
  const [decimals, percent] = getBpsValues($input)
  $output.innerText = `${percent}% (${decimals})`
}

function getBpsValues ($input) {
  const bps = Number($input.value) || 0
  const permille = (bps / 10) || 0
  const percent = (bps / 100) || 0
  const decimals = (bps / 100 / 100) || 0
  return [
    decimals,
    percent,
    permille,
    bps
  ]
}

function getSlippageValues ($input) {
  const percent = Number($input.value) || 0
  const decimals = (percent / 100) || 0
  return [
    decimals,
    percent
  ]
}

function updateSlippageOutput ($input, $output) {
  const [decimals, percent] = getSlippageValues($input)
  $output.innerText = `${percent}% (${decimals})`
}

function calculate () {
  $output.innerText = ''

  const amountIn = Number($amountIn.value)
  const ammFeeBps = Number($ammFeeBps.value)
  const bonderFeeBps = Number($bonderFeeBps.value)
  const slippageTolerance = Number($slippageTolerance.value)
  const decimals = Number($decimals.value)
  const deadlineMinutes = Number($deadlineMinutes.value)

  console.log(`amountIn: ${amountIn}`)
  console.log(`ammFeeBps: ${ammFeeBps}`)
  console.log(`bonderFeeBps: ${bonderFeeBps}`)
  console.log(`slippageTolerance: ${slippageTolerance}`)
  console.log(`decimals: ${decimals}`)

  const [ammFeeDecimals] = getBpsValues($ammFeeBps)
  const [bonderFeeDecimals] = getBpsValues($bonderFeeBps)
  const [slippageToleranceDecimals] = getSlippageValues($slippageTolerance)

  const parsedAmountIn = BigNumber.from(parseUnits(amountIn.toString(), decimals))
  const parsedAmmFeeAmount = BigNumber.from(parseUnits((amountIn * ammFeeDecimals).toString(), decimals))
  const parsedBonderFee = BigNumber.from(parseUnits((bonderFeeDecimals * amountIn).toString(), decimals))
  const parsedSlippageToleranceAmount = BigNumber.from(parseUnits((slippageToleranceDecimals * amountIn).toString(), decimals))
  const parsedAmountOutMin = parsedAmountIn.sub(parsedSlippageToleranceAmount).sub(parsedAmmFeeAmount)
  const deadline = ((Date.now() / 1000) + (deadlineMinutes * 60)) | 0

  console.log(`parsedAmountIn: ${parsedAmountIn.toString()}`)
  console.log(`parsedBonderFee: ${parsedBonderFee.toString()}`)
  console.log(`parsedSlippageToleranceAmount: ${parsedSlippageToleranceAmount.toString()}`)
  console.log(`parsedAmountOutMin: ${parsedAmountOutMin.toString()}`)
  console.log(`deadline: ${deadline}`)

  $output.innerHTML = `
<div>amountIn: <pre>${parsedAmountIn.toString()}</pre></div>
<div>amountOutMin: <pre>${parsedAmountOutMin.toString()}</pre></div>
<div>bonderFee: <pre>${parsedBonderFee.toString()}</pre></div>
<div>deadline: <pre>${deadline}</pre></div>
`
}

// event listeners

$ammFeeBps.addEventListener('input', (event) => {
  updateBpsOutput($ammFeeBps, $ammFeePercent)
})

$bonderFeeBps.addEventListener('input', (event) => {
  updateBpsOutput($bonderFeeBps, $bonderFeePercent)
})

$slippageTolerance.addEventListener('input', (event) => {
  updateSlippageOutput($slippageTolerance, $slippageTolerancePercent)
})

$form.addEventListener('submit', (event) => {
  event.preventDefault()
  try {
    calculate()
  } catch (err) {
    console.error(err)
  }
})

// init
function main () {
  updateBpsOutput($ammFeeBps, $ammFeePercent)
  updateBpsOutput($bonderFeeBps, $bonderFeePercent)
  updateSlippageOutput($slippageTolerance, $slippageTolerancePercent)
  calculate()
}

main()
