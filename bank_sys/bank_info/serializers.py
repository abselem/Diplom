from rest_framework import serializers
import datetime
from .models import *


class CitizenSerializer(serializers.ModelSerializer):
    class Meta:
        model = Citizen
        fields = ['id', 'iin']


class UserSerializer(serializers.ModelSerializer):
    confirm_password = serializers.CharField(write_only=True, required=True)
    iin = serializers.CharField(max_length=12, min_length=12)

    class Meta:
        model = User
        fields = ['username', 'password', 'email', 'iin', 'confirm_password']
        extra_kwargs = {'password': {'write_only': True}}

    def validate(self, data):
        if User.objects.filter(email=data['email']).exists():
            raise serializers.ValidationError({'email': 'Email уже используется'})
        if User.objects.filter(iin=data['iin']).exists():
            raise serializers.ValidationError({'iin': 'IIN уже используется'})
        if data['password'] != data['confirm_password']:
            raise serializers.ValidationError({'confirm_password': 'Пароли не совпадают'})
        return data

    def create(self, validated_data):
        validated_data.pop('confirm_password')
        citizen_iin = validated_data['iin']

        try:
            citizen = Citizen.objects.get(iin=citizen_iin)
            validated_data['iin'] = citizen
        except Citizen.DoesNotExist:
            raise serializers.ValidationError({'iin': 'Данного ИИН нету в системе'})
        user = User(**validated_data)
        user.set_password(validated_data['password'])
        user.save()
        return user


class CurrencySerializer(serializers.ModelSerializer):
    class Meta:
        model = Currency
        fields = '__all__'


class PaymentSystemSerializer(serializers.ModelSerializer):
    class Meta:
        model = PaymentKinds
        fields = ('name', 'image', 'first_num')


class CardKindsSerializer(serializers.ModelSerializer):
    payment_sys = PaymentSystemSerializer()

    class Meta:
        model = CardKinds
        fields = ('id', 'name', 'virtual', 'pict', 'additional_info', 'paid', 'payment_sys')


class DepositKindsSerializer(serializers.ModelSerializer):
    class Meta:
        model = DepositKinds
        fields = '__all__'


class CreditKindsSerializer(serializers.ModelSerializer):
    class Meta:
        model = CreditKinds
        fields = '__all__'


class CardSerializer(serializers.ModelSerializer):

    class Meta:
        model = Card
        fields = ('id', 'name', 'card_num', 'expiration_date', 'cvv', 'bik', 'iban', 'sum', 'kind',
                  'client')


class DepositSerializer(serializers.ModelSerializer):

    class Meta:
        model = Deposit
        fields = '__all__'


class CreditSerializer(serializers.ModelSerializer):

    class Meta:
        model = Credit
        fields = '__all__'


class BankSerializer(serializers.ModelSerializer):
    class Meta:
        model = Bank
        fields = '__all__'


class PaymentCompanyTransfersSerializer(serializers.ModelSerializer):
    class Meta:
        model = PaymentCompanyTransfers
        fields = '__all__'


class CardTransferSerializer(serializers.ModelSerializer):
    class Meta:
        model = CardTransfer
        fields = '__all__'


class DepositTransferSerializer(serializers.ModelSerializer):
    class Meta:
        model = DepositTransfer
        fields = '__all__'


class UserInfoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Citizen
        fields = '__all__'


class CardKindSerializer(serializers.ModelSerializer):
    class Meta:
        model = CardKinds
        fields = ['pict']


class UserCardSerializer(serializers.ModelSerializer):
    kind = CardKindSerializer(read_only=True)

    class Meta:
        model = Card
        fields = '__all__'


class DepositKindSerializer(serializers.ModelSerializer):
    class Meta:
        model = DepositKinds
        fields = ['pict', 'percent']


class UserDepositSerializer(serializers.ModelSerializer):
    deposit_kind = DepositKindSerializer(read_only=True)

    class Meta:
        model = Deposit
        fields = '__all__'


class CreditKindSerializer(serializers.ModelSerializer):
    class Meta:
        model = CreditKinds
        fields = ['name', 'pict', 'percent']


class UserCreditSerializer(serializers.ModelSerializer):
    credit_kind = CreditKindSerializer(read_only=True)
    current_month = serializers.SerializerMethodField()

    def get_current_month(self, obj):
        today = datetime.date.today()
        start_date = obj.created_at.date()
        months = (today.year - start_date.year) * 12 + (today.month - start_date.month) + 1
        return months

    class Meta:
        model = Credit
        fields = '__all__'


class CardTransferSerializerInfoCard(serializers.ModelSerializer):

    class Meta:
        model = Card
        fields = ['card_num']


class CardTransferSerializerInfo(serializers.ModelSerializer):
    sender = CardTransferSerializerInfoCard(read_only=True)
    recipient = CardTransferSerializerInfoCard(read_only=True)

    class Meta:
        model = CardTransfer
        fields = ['sender', 'recipient', 'amount', 'message', 'created_at']


class CardDepositTransferSerializerInfo(serializers.ModelSerializer):

    class Meta:
        model = DepositTransfer
        fields = ['sender_card', 'recipient_deposit', 'amount', 'message', 'created_at']


class PayTransferInfoSerializer(serializers.ModelSerializer):

    class Meta:
        model = PaymentCompany
        fields = ['name', 'logo']


class PayTransferSerializerInfo(serializers.ModelSerializer):
    company = PayTransferInfoSerializer(read_only=True)

    class Meta:
        model = PaymentCompanyTransfers
        fields = ['company', 'sum', 'bill_pay_num', 'created_at']


class CreditTransferSerializer(serializers.ModelSerializer):

    class Meta:
        model = CreditTransfers
        fields = '__all__'


class CreditTransferHistorySerializer(serializers.ModelSerializer):
    card = CardTransferSerializerInfoCard(read_only=True)

    class Meta:
        model = CreditTransfers
        fields = '__all__'


class PaymentCompanyCategoriesSerializer(serializers.ModelSerializer):
    class Meta:
        model = PaymentCompanyCategories
        fields = ('name', 'logo')


class PaymentCompanySerializer(serializers.ModelSerializer):
    class Meta:
        model = PaymentCompany
        fields = ['id', 'name', 'logo', 'bill', 'bill_count_number']
