from django.contrib import admin
from .models import *


class BankAdmin(admin.ModelAdmin):
    list_display = ('title', 'time_create')


class CurrencyAdmin(admin.ModelAdmin):
    list_display = ('dollar_sell', 'ruble_sell', 'euro_sell')


class PaymentKindsAdmin(admin.ModelAdmin):
    list_display = ('name',)


class CardKindsAdmin(admin.ModelAdmin):
    list_display = ('name', 'payment_sys', 'virtual')


class DepositKindsAdmin(admin.ModelAdmin):
    list_display = ('name', 'percent', 'take_off', 'min_sum', 'min_year', 'max_year')


class CreditKindsAdmin(admin.ModelAdmin):
    list_display = ('name', 'percent', 'deposit', 'max_sum', 'max_year', 'make_a_decision')


class CitizenAdmin(admin.ModelAdmin):
    list_display = ('iin', 'id_num', 'last_name')


class CustomUserAdmin(admin.ModelAdmin):
    list_display = ('username', 'email', 'first_name', 'last_name', 'is_staff', 'is_active')
    list_filter = ('is_staff', 'is_superuser', 'is_active', 'groups')
    search_fields = ('username', 'email', 'first_name', 'last_name', 'iin')
    ordering = ('username', 'iin')


class CardAdmin(admin.ModelAdmin):
    list_display = ('card_num', 'name', 'expiration_date', 'cvv', 'bik', 'iban', 'sum', 'kind', 'client')


class DepositAdmin(admin.ModelAdmin):
    list_display = ('client', 'deposit_kind', 'sum', 'bik', 'iban')


class CardTransferAdmin(admin.ModelAdmin):
    list_display = ('sender', 'recipient', 'amount', 'message')


admin.site.register(Bank, BankAdmin)
admin.site.register(Currency, CurrencyAdmin)
admin.site.register(PaymentKinds, PaymentKindsAdmin)
admin.site.register(CardKinds, CardKindsAdmin)
admin.site.register(DepositKinds, DepositKindsAdmin)
admin.site.register(CreditKinds, CreditKindsAdmin)
admin.site.register(Citizen, CitizenAdmin)
admin.site.register(User, CustomUserAdmin)
admin.site.register(Card, CardAdmin)
admin.site.register(Deposit, DepositAdmin)
admin.site.register(CardTransfer, CardTransferAdmin)
admin.site.register(DepositTransfer)
admin.site.register(PaymentCompanyCategories)
admin.site.register(PaymentCompany)
admin.site.register(Credit)
admin.site.register(PaymentCompanyTransfers)
admin.site.register(CreditTransfers)
