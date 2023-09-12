from django.db import models
from django.contrib.auth.models import AbstractUser


class Bank(models.Model):
    title = models.CharField(max_length=255, primary_key=True)
    logo = models.ImageField(upload_to='images/bank_logo/')
    time_create = models.DateTimeField(auto_now_add=True)
    sum = models.DecimalField(max_digits=500, decimal_places=1, blank=True, null=True)
    call_center_phone1 = models.CharField(max_length=20)
    call_center_phone2 = models.CharField(max_length=20)
    address = models.CharField(max_length=50)
    email = models.CharField(max_length=50)
    additional_info = models.TextField()

    def __str__(self):
        return self.title


class Currency(models.Model):

    dollar_buy = models.DecimalField(max_digits=5, decimal_places=1, blank=True, null=True)
    ruble_buy = models.DecimalField(max_digits=5, decimal_places=1, blank=True, null=True)
    euro_buy = models.DecimalField(max_digits=5, decimal_places=1, blank=True, null=True)

    dollar_sell = models.DecimalField(max_digits=5, decimal_places=1, blank=True, null=True)
    ruble_sell = models.DecimalField(max_digits=5, decimal_places=1, blank=True, null=True)
    euro_sell = models.DecimalField(max_digits=5, decimal_places=1, blank=True, null=True)

    def __str__(self):
        return f'{self.dollar_sell} - {self.ruble_sell} - {self.euro_sell}'


class PaymentKinds(models.Model):
    name = models.CharField(max_length=50)
    image = models.ImageField(upload_to='images/payment/')
    first_num = models.IntegerField()

    def __str__(self):
        return f'{self.name}'


class CardKinds(models.Model):
    name = models.CharField(max_length=50)
    virtual = models.BooleanField(default=True)
    payment_sys = models.ForeignKey(PaymentKinds, on_delete=models.CASCADE)
    paid = models.BooleanField(default=False)
    pict = models.ImageField(upload_to='images/cards/')
    additional_info = models.TextField()

    def __str__(self):
        return f'{self.name}'


class DepositKinds(models.Model):
    name = models.CharField(max_length=100)
    percent = models.FloatField()
    take_off = models.BooleanField()
    min_sum = models.IntegerField()
    min_year = models.IntegerField()
    max_year = models.IntegerField()
    additional_info = models.TextField()
    pict = models.ImageField(upload_to='images/deposits/', null=True)

    def __str__(self):
        return f'{self.name}'


class CreditKinds(models.Model):
    name = models.CharField(max_length=100)
    percent = models.FloatField()
    deposit = models.BooleanField()
    max_sum = models.IntegerField()
    max_year = models.IntegerField()
    make_a_decision = models.CharField(max_length=100)
    additional_info = models.TextField()
    pict = models.ImageField(upload_to='images/credits/', null=True)

    def __str__(self):
        return f'{self.name}'


class Citizen(models.Model):
    iin = models.CharField(max_length=12, unique=True)
    first_name = models.CharField(max_length=255)
    last_name = models.CharField(max_length=255)
    middle_name = models.CharField(max_length=255)
    date_of_birth = models.DateField()
    phone = models.CharField(max_length=20)
    address = models.CharField(max_length=255)
    id_num = models.CharField(max_length=10)
    id_issue_date = models.DateField()
    id_issuer = models.CharField(max_length=255)
    person_picture = models.ImageField(upload_to='citizens/')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.iin} {self.first_name} {self.middle_name}"


class User(AbstractUser):
    username = models.CharField(max_length=30, unique=True, blank=True, null=True)
    email = models.EmailField(null=True, blank=True, unique=True)
    iin = models.ForeignKey(Citizen, on_delete=models.SET_NULL, null=True, blank=True)
    credit_status = models.BooleanField(default=False)

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = []

    def __str__(self):
        return f"{self.iin}"


class Card(models.Model):
    name = models.CharField(max_length=255)
    card_num = models.CharField(max_length=16, unique=True)
    expiration_date = models.CharField(max_length=5)
    cvv = models.CharField(max_length=3)
    bik = models.CharField(max_length=9)
    iban = models.CharField(max_length=34)
    sum = models.DecimalField(max_digits=10, decimal_places=1, blank=True, null=True)
    kind = models.ForeignKey(CardKinds, on_delete=models.CASCADE)
    client = models.ForeignKey(User, on_delete=models.CASCADE)
    pin = models.CharField(max_length=4, default='0000')

    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f'{self.card_num} {self.name} {self.kind}'


class Deposit(models.Model):
    client = models.ForeignKey(User, on_delete=models.CASCADE)
    deposit_kind = models.ForeignKey(DepositKinds, on_delete=models.CASCADE)
    name = models.CharField(max_length=255, null=True)
    sum = models.DecimalField(max_digits=10, decimal_places=1, blank=True, null=True)
    bik = models.CharField(max_length=9)
    iban = models.CharField(max_length=34)

    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f'{self.client} {self.deposit_kind}'


class Credit(models.Model):
    client = models.ForeignKey(User, on_delete=models.CASCADE)
    credit_kind = models.ForeignKey(CreditKinds, on_delete=models.CASCADE)
    sum = models.DecimalField(max_digits=10, decimal_places=1, blank=True, null=True)
    sum_vid = models.DecimalField(max_digits=10, decimal_places=1, blank=True, null=True)
    sum_pog = models.DecimalField(max_digits=10, decimal_places=1, blank=True, null=True, default=0)
    bik = models.CharField(max_length=9)
    iban = models.CharField(max_length=34)
    percent = models.FloatField()
    month_count = models.IntegerField()

    is_active = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f'{self.client} {self.credit_kind}'


class CardTransfer(models.Model):
    sender = models.ForeignKey(Card, on_delete=models.CASCADE)
    recipient = models.ForeignKey(Card, on_delete=models.CASCADE, related_name='принимающий')
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    message = models.CharField(max_length=300)

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f'{self.sender} {self.amount} {self.recipient}'


class DepositTransfer(models.Model):
    sender_card = models.ForeignKey(Card, on_delete=models.CASCADE)
    recipient_deposit = models.ForeignKey(Deposit, on_delete=models.CASCADE, related_name='принимающий')
    amount = models.DecimalField(max_digits=100, decimal_places=2)
    date = models.DateTimeField(auto_now_add=True)
    message = models.CharField(max_length=100)

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f'{self.sender_card} {self.amount} {self.recipient_deposit}'


class PaymentCompanyCategories(models.Model):
    name = models.CharField(max_length=255, null=True)
    logo = models.ImageField(upload_to='images/categories_logo/', null=True)

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f'{self.name}'


class PaymentCompany(models.Model):
    name = models.CharField(max_length=255, null=True)
    logo = models.ImageField(upload_to='images/categories_logo/')
    bill = models.DecimalField(max_digits=50, decimal_places=2)
    kind = models.ForeignKey(PaymentCompanyCategories, on_delete=models.CASCADE)
    bill_count_number = models.IntegerField()

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f'{self.name} - {self.bill}'


class PaymentCompanyTransfers(models.Model):
    client = models.ForeignKey(User, on_delete=models.CASCADE, null=True)
    company = models.ForeignKey(PaymentCompany, on_delete=models.CASCADE)
    sum = models.DecimalField(max_digits=50, decimal_places=2)
    card = models.ForeignKey(Card, on_delete=models.CASCADE)
    bill_pay_num = models.CharField(max_length=30)

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f'{self.client} - {self.sum}'


class CreditTransfers(models.Model):
    client = models.ForeignKey(User, on_delete=models.CASCADE, null=True)
    credit = models.ForeignKey(Credit, on_delete=models.CASCADE, null=True)
    sum = models.DecimalField(max_digits=50, decimal_places=2)
    card = models.ForeignKey(Card, on_delete=models.CASCADE)

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f'{self.client} - {self.sum}'

