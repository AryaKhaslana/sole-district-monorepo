<!DOCTYPE html>
<html>
<head>
    <title>Bayar Dulu Bos</title>
    <script type="text/javascript"
      src="https://app.sandbox.midtrans.com/snap/snap.js"
      data-client-key="{{ config('services.midtrans.client_key') }}"></script>
</head>
<body>

    <h1>Total Bayar: Rp 50.000</h1>
    <button id="pay-button">BAYAR SEKARANG</button>

    <script type="text/javascript">
      var payButton = document.getElementById('pay-button');
      payButton.addEventListener('click', function () {
        // Panggil Snap pake Token dari Controller tadi
        window.snap.pay('{{ $snapToken }}', {
          onSuccess: function(result){
            alert("Wih Mantap! Pembayaran Sukses!");
            console.log(result);
          },
          onPending: function(result){
            alert("Yah, kok nunggu? Bayar buruan!");
            console.log(result);
          },
          onError: function(result){
            alert("Waduh, Gagal Bos!");
            console.log(result);
          },
          onClose: function(){
            alert('Yah kok ditutup? Gajadi beli?');
          }
        })
      });
    </script>
</body>
</html>