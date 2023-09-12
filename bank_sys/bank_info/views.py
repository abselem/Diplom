from rest_framework import views, permissions, generics, authentication, status
from rest_framework_simplejwt.authentication import JWTAuthentication
from django.contrib.auth import get_user_model
from rest_framework.views import APIView
from django.db.models import Sum, Q
from rest_framework.exceptions import ValidationError
from django.shortcuts import get_object_or_404
from .models import *
from .serializers import *
from django.core.exceptions import ObjectDoesNotExist
from rest_framework.response import Response
import cv2
from datetime import datetime, timedelta, date
from random import randint
from io import BytesIO
import base64
from PIL import Image


class CurrencyListAPIView(APIView):
    permission_classes = [permissions.AllowAny]

    def get(self, request):
        first_output = Currency.objects.first()
        output = {
            "usd": [first_output.dollar_buy, first_output.dollar_sell],
            "ruble": [first_output.ruble_buy, first_output.ruble_sell],
            "euro": [first_output.euro_buy, first_output.euro_sell],
        }
        return Response(output)


class CardKindsList(APIView):
    serializer_class = CardKindsSerializer
    permission_classes = [permissions.AllowAny]

    def get(self, request, format=None):
        card_kinds = CardKinds.objects.all()
        serializer = CardKindsSerializer(card_kinds, many=True)
        return Response(serializer.data)


class CardKindsDetailView(APIView):
    serializer_class = CardKindsSerializer
    permission_classes = [permissions.AllowAny]

    def get_object(self, name):
        try:
            return CardKinds.objects.get(name=name)
        except CardKinds.DoesNotExist:
            raise views.Http404

    def get(self, request, name, format=None):
        card_kind = self.get_object(name)
        serializer = CardKindsSerializer(card_kind)
        return Response(serializer.data)


class DepositKindsList(APIView):
    permission_classes = [permissions.AllowAny]

    def get(self, request):
        queryset = DepositKinds.objects.all()
        serializer = DepositKindsSerializer(queryset, many=True)
        return Response(serializer.data)


class DepositKindsDetailView(APIView):
    serializer_class = DepositKindsSerializer
    permission_classes = [permissions.AllowAny]

    def get_object(self, name):
        try:
            return DepositKinds.objects.get(name=name)
        except DepositKinds.DoesNotExist:
            raise views.Http404

    def get(self, request, name, format=None):
        deposit_kind = self.get_object(name)
        serializer = DepositKindsSerializer(deposit_kind)
        return Response(serializer.data)


class CreditKindsList(APIView):
    permission_classes = [permissions.AllowAny]

    def get(self, request, format=None):
        credits_kinds = CreditKinds.objects.all()
        serializer = CreditKindsSerializer(credits_kinds, many=True)
        return Response(serializer.data)


class CreditKindsDetailView(APIView):
    serializer_class = CreditKindsSerializer
    permission_classes = [permissions.AllowAny]

    def get_object(self, name):
        try:
            return CreditKinds.objects.get(name=name)
        except CreditKinds.DoesNotExist:
            raise views.Http404

    def get(self, request, name, format=None):
        credit_kind = self.get_object(name)
        serializer = CreditKindsSerializer(credit_kind)
        return Response(serializer.data)


class FaceComparisonAPIView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        iin = request.data.get('iin')
        image_data = base64.b64decode((request.data.get('image')).split(",")[1])
        # создаем объект изображения
        image = Image.open(BytesIO(image_data))
        temp_file = "temp.jpg"
        image.save(temp_file)

        # Find citizen by iin
        try:
            citizen = Citizen.objects.get(iin=iin)
        except Citizen.DoesNotExist:
            return Response({"detail": "По данному ИИН нету записей.", 'result': False}, status=404)

        # Compare images
        similarity_percent = compare_images(citizen.person_picture.path, temp_file)

        # Return result
        return Response(similarity_percent)


def compare_images(image1_path, image2_path):
    # Загружаем изображения
    image1 = cv2.imread(image1_path)
    image2 = cv2.imread(image2_path)

    # Create object for face detection
    face_detector = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_frontalface_default.xml')

    # Определение лица
    gray1 = cv2.cvtColor(image1, cv2.COLOR_BGR2GRAY)
    faces1 = face_detector.detectMultiScale(gray1, scaleFactor=1.1, minNeighbors=5, minSize=(30, 30))

    # Определение лица
    gray2 = cv2.cvtColor(image2, cv2.COLOR_BGR2GRAY)
    faces2 = face_detector.detectMultiScale(gray2, scaleFactor=1.1, minNeighbors=5, minSize=(30, 30))

    # Проверяем наличие лиц на обоих изображениях
    if len(faces1) == 0:
        return {'detail': "Лица не обнаружены на первом изображении", 'result': False}
    if len(faces2) == 0:
        return {'detail': "Лица не обнаружены на втором изображении", 'result': False}

    # Сравниваем найденные лица
    overlap_percents = []
    for (x1, y1, w1, h1) in faces1:
        for (x2, y2, w2, h2) in faces2:
            # Считаем процент перекрытия двух лиц
            x_overlap = max(0, min(x1 + w1, x2 + w2) - max(x1, x2))
            y_overlap = max(0, min(y1 + h1, y2 + h2) - max(y1, y2))
            overlap_area = x_overlap * y_overlap
            total_area = min(w1 * h1, w2 * h2)
            overlap_percent = overlap_area / total_area * 100
            overlap_percents.append(overlap_percent)

    # Вычисляем процент схожести
    if len(overlap_percents) > 0:
        similarity_percent = sum(overlap_percents) / len(overlap_percents)
    else:
        similarity_percent = 0.0


    # Вычисляем процент схожести
    if similarity_percent == 0:
        return {'detail': "Лица на обоих изображениях не совпадают", 'result': False}

    return {'detail': similarity_percent, 'result': True}


User = get_user_model()


class RegisterAPIView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [permissions.AllowAny]


class CardCreateView(generics.CreateAPIView):
    permission_classes = [permissions.IsAuthenticated]
    authentication_classes = [JWTAuthentication]
    serializer_class = CardSerializer

    def create(self, request, *args, **kwargs):
        # проверяем есть ли у пользователя карта
        if Card.objects.filter(client=request.user).exists():
            return Response({'error': 'У пользователя имеется карта'}, status=400)

        # Получаем payment_kind с переданным kind_id
        card_kind = CardKinds.objects.filter(id=request.data.get('kind')).first()
        first_num = card_kind.payment_sys.first_num

        # Генерируем случайный CVV из 3 цифр
        cvv = randint(100, 999)

        # Генерируем случайный IBAN, начинающийся с KZ и состоящий из 18 цифр
        iban = f'KZ{"%017d" % randint(0, 99999999999999999)}'

        # Генерируем номер карты, начинающийся с payment_kind.first_num и состоящий из 15 цифр
        card_num = f'{first_num}{"%015d" % randint(0, 99999999999999)}'

        # Получаем текущую дату и добавляем 3 года для получения даты окончания действия карты
        expiration_date = (datetime.now() + timedelta(days=1095)).strftime('%m/%y')

        # Создаем объект карты с полученными данными и сохраняем его
        card = Card.objects.create(
            name=request.data.get('name'),
            card_num=card_num,
            expiration_date=expiration_date,
            cvv=cvv,
            bik='KAZKZ',
            iban=iban,
            sum=0,
            kind=card_kind,
            client=request.user
        )

        serializer = self.get_serializer(card)
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=201, headers=headers)


class DepositCreateView(generics.CreateAPIView):
    permission_classes = [permissions.IsAuthenticated]
    authentication_classes = [JWTAuthentication]
    serializer_class = DepositSerializer

    def create(self, request, *args, **kwargs):
        # проверяем есть ли у пользователя карта
        if Deposit.objects.filter(client=request.user).exists():
            return Response({'error': 'У пользователя имеется депозит'}, status=400)

        deposit_kind = DepositKinds.objects.filter(id=request.data.get('kind')).first()

        # Генерируем случайный IBAN, начинающийся с KZ и состоящий из 18 цифр
        iban = f'KZ{"%017d" % randint(0, 99999999999999999)}'

        # Получаем текущую дату и добавляем 3 года для получения даты окончания действия карты
        expiration_date = (datetime.now() + timedelta(days=1095)).strftime('%m/%y')

        # Создаем объект карты с полученными данными и сохраняем его
        deposit = Deposit.objects.create(
            name=request.data.get('name'),
            bik='KAZKZ',
            iban=iban,
            sum=0,
            deposit_kind=deposit_kind,
            client=request.user
        )

        serializer = self.get_serializer(deposit)
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=201, headers=headers)


class CreditCreateView(generics.CreateAPIView):
    permission_classes = [permissions.IsAuthenticated]
    authentication_classes = [JWTAuthentication]
    serializer_class = CreditSerializer

    def create(self, request, *args, **kwargs):
        # проверяем есть ли у пользователя карта
        if Credit.objects.filter(client=request.user).exists():
            return Response({'error': 'У пользователя имеется кредит'}, status=400)

        credit_kind = CreditKinds.objects.filter(id=request.data.get('kind')).first()

        # Генерируем случайный IBAN, начинающийся с KZ и состоящий из 18 цифр
        iban = f'KZ{"%017d" % randint(0, 99999999999999999)}'

        bank = Bank.objects.first()

        if bank.sum <= request.data.get('sum'):
            return Response({'error': 'Обратитесь в банк'}, status=400)

        bank.sum += request.data.get('sum')
        bank.save()

        card = Card.objects.filter(client=request.user).first()

        if card:
            return Response({'error': 'У вас нету карты'}, status=400)

        card.sum += request.data.get('sum')
        card.save()

        # Создаем объект карты с полученными данными и сохраняем его
        credit = Credit.objects.create(
            bik='KAZKZ',
            iban=iban,
            sum=request.data.get('sum'),
            sum_vid=request.data.get('sum_vid'),
            credit_kind=credit_kind,
            percent=request.data.get('percent'),
            month_count=request.data.get('month_count'),
            client=request.user
        )

        serializer = self.get_serializer(credit)
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=201, headers=headers)


class HeaderFooterAPIView(APIView):
    permission_classes = [permissions.AllowAny]

    def get(self, request, format=None):
        bank = Bank.objects.all()
        serializer = BankSerializer(bank, many=True)
        return Response(serializer.data[0])


class PayForCompany(generics.CreateAPIView):
    permission_classes = [permissions.IsAuthenticated]
    authentication_classes = [JWTAuthentication]
    serializer_class = PaymentCompanyTransfersSerializer

    def create(self, request, *args, **kwargs):
        company = get_object_or_404(PaymentCompany, id=request.data.get('company'))
        card = Card.objects.filter(client=request.user).first()
        amount = int(request.data.get('amount'))
        if amount is None or card.sum < amount:
            return Response({'error': 'Not enough funds on the card.'}, status=400)
        card.sum -= amount
        card.save()
        company.bill += amount
        company.save()
        PaymentCompanyTransfers.objects.create(
            client=request.user,
            company=company,
            sum=amount,
            card=card,
            bill_pay_num=request.data.get('bill_count_number'),
        )
        return Response({'success': 'Payment has been made successfully.'}, status=201)


class CardTransferView(APIView):
    permission_classes = (permissions.IsAuthenticated,)
    authentication_classes = [JWTAuthentication]
    serializer_class = CardTransferSerializer

    def post(self, request):
        sender_card = request.data.get('sender_card')
        amount = int(request.data.get('amount'))
        message = request.data.get('message')

        sender_card = get_object_or_404(Card, id=sender_card)
        recipient_card = None
        if request.data.get('card_num'):
            recipient_card = get_object_or_404(Card, card_num=request.data.get('card_num'))
        elif request.data.get('iban'):
            recipient_card = get_object_or_404(Card, iban=request.data.get('iban'))
        elif request.data.get('phone'):
            citizen = get_object_or_404(Citizen, phone=request.data.get('phone'))
            user = get_object_or_404(User, iin=citizen)
            recipient_card = get_object_or_404(Card, client=user)

        if sender_card.sum < amount:
            return Response({'error': 'Недостаточно средств.'}, status=status.HTTP_400_BAD_REQUEST)

        sender_card.sum -= amount
        sender_card.save()
        recipient_card.sum += amount
        recipient_card.save()

        transfer = CardTransfer.objects.create(
            sender=sender_card,
            recipient=recipient_card,
            amount=amount,
            message=message,
        )
        return Response({'success': 'Перевод прошел успешно.'}, status=status.HTTP_201_CREATED)


class DepositTransferView(APIView):
    permission_classes = (permissions.IsAuthenticated,)
    authentication_classes = [JWTAuthentication]
    serializer_class = DepositTransferSerializer

    def post(self, request):
        sender_card_id = request.data.get('sender_card')
        recipient_deposit_id = request.data.get('recipient_deposit')
        amount = request.data.get('amount')

        try:
            sender_card = Card.objects.get(id=sender_card_id)
            recipient_deposit = Deposit.objects.get(id=recipient_deposit_id)
        except ObjectDoesNotExist:
            return Response({'error': 'Карта не найдена.'}, status=status.HTTP_404_NOT_FOUND)

        try:
            amount = int(amount)
        except ValueError:
            return Response({'error': 'Неверный формат суммы.'}, status=status.HTTP_400_BAD_REQUEST)

        if request.data.get('from_card'):
            if sender_card.sum < amount:
                return Response({'error': 'Недостаточно средств.'}, status=status.HTTP_400_BAD_REQUEST)

            message = "Пополнение"
            sender_card.sum -= amount
            sender_card.save()

            bank = Bank.objects.first()
            bank.sum += amount
            bank.save()

            recipient_deposit.sum += amount
            recipient_deposit.save()
        else:
            if recipient_deposit.sum < amount:
                return Response({'error': 'Недостаточно средств.'}, status=status.HTTP_400_BAD_REQUEST)

            message = "Снятие"
            recipient_deposit.sum -= amount
            recipient_deposit.save()

            bank = Bank.objects.first()
            bank.sum -= amount
            bank.save()

            sender_card.sum += amount
            sender_card.save()

        transfer = DepositTransfer.objects.create(
            sender_card=sender_card,
            recipient_deposit=recipient_deposit,
            amount=amount,
            message=message,
        )
        return Response({'success': 'Перевод прошел успешно.'}, status=status.HTTP_201_CREATED)


class UserInfoView(APIView):
    permission_classes = (permissions.IsAuthenticated,)
    authentication_classes = [JWTAuthentication]

    def get(self, request):
        try:
            user = request.user
            citizen = user.iin
        except Citizen.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)

        serializer = UserInfoSerializer(citizen)
        return Response(serializer.data, status=status.HTTP_200_OK)


class UserCardInfoView(APIView):
    permission_classes = (permissions.IsAuthenticated,)
    authentication_classes = [JWTAuthentication]

    def get(self, request):
        try:
            user = request.user
            card = Card.objects.get(client=user)
        except Card.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)

        serializer = UserCardSerializer(card)
        return Response(serializer.data, status=status.HTTP_200_OK)


class UserDepositInfoView(APIView):
    permission_classes = (permissions.IsAuthenticated,)
    authentication_classes = [JWTAuthentication]

    def get(self, request):
        try:
            user = request.user
            deposit = Deposit.objects.get(client=user)
        except Deposit.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)

        # Get the number of years since deposit creation
        years_since_deposit_creation = (date.today() - deposit.created_at.date()) // timedelta(days=365)

        # Get the number of deposit rate records in the DepositTransfer table
        deposit_rate_records_count = DepositTransfer.objects.filter(recipient_deposit=deposit, message='Депозитная ставка').count()

        # Check if the number of years matches the number of deposit rate records
        if years_since_deposit_creation <= deposit_rate_records_count:
            serializer = UserDepositSerializer(deposit)
            return Response(serializer.data, status=status.HTTP_200_OK)


        # Вычисляем, прошел ли год со дня открытия депозита
        one_year_ago = datetime.now() - timedelta(days=365)
        deposit_created_at = deposit.created_at.replace(tzinfo=None)
        if deposit_created_at > one_year_ago:
            # Год еще не прошел, возвращаем текущий баланс
            serializer = UserDepositSerializer(deposit)
            return Response(serializer.data, status=status.HTTP_200_OK)

        # Проверяем, сумму пополнения и снятия за весь период депозита
        deposits_sum = DepositTransfer.objects.filter(
            recipient_deposit=deposit
        ).aggregate(
            deposits_sum=Sum('amount', filter=Q(message='Пополнение'))
        )['deposits_sum'] or 0

        withdrawals_sum = DepositTransfer.objects.filter(
            recipient_deposit=deposit,
            created_at__gt=deposit_created_at
        ).aggregate(
            withdrawals_sum=Sum('amount', filter=Q(message='Снятие'))
        )['withdrawals_sum'] or 0

        if deposits_sum == withdrawals_sum:
            # Суммы пополнения и снятия равны, не начисляем проценты
            serializer = UserDepositSerializer(deposit)
            return Response(serializer.data, status=status.HTTP_200_OK)

        # Вычисляем проценты и добавляем запись в DepositTransfer
        difference = deposits_sum - withdrawals_sum
        percent = int(deposit.deposit_kind.percent)
        earned_percent = difference * percent / 100

        deposit.sum += earned_percent
        deposit.save()

        bank = Bank.objects.first()
        bank.sum -= earned_percent
        bank.save()

        deposit_transfer = DepositTransfer.objects.create(
            sender_card=Card.objects.get(client=request.user).first(),
            recipient_deposit=deposit,
            amount=earned_percent,
            message='Депозитная ставка'
        )

        serializer = UserDepositSerializer(deposit)
        return Response(serializer.data, status=status.HTTP_200_OK)


class UserCreditInfoView(APIView):
    permission_classes = (permissions.IsAuthenticated,)
    authentication_classes = [JWTAuthentication]

    def get(self, request):
        try:
            user = request.user
            credit = Credit.objects.get(client=user)
        except Credit.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)

        today = date.today()
        credit_created = credit.created_at.date()
        months = (today.year - credit_created.year) * 12 + (today.month - credit_created.month)
        credit_transfers_count = CreditTransfers.objects.filter(credit=credit).count()

        if months > credit_transfers_count:
            user.credit_status = True
            user.save()

        serializer = UserCreditSerializer(credit)
        return Response(serializer.data, status=status.HTTP_200_OK)


class CardTransferList(APIView):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = CardTransferSerializerInfo
    authentication_classes = [JWTAuthentication]

    def get(self, request):
        card = Card.objects.filter(client=request.user).first()
        card_transfers = CardTransfer.objects.filter(sender=card).order_by('-created_at')
        serializer = self.serializer_class(card_transfers, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


class CardTransferGetterList(APIView):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = CardTransferSerializerInfo
    authentication_classes = [JWTAuthentication]

    def get(self, request):
        card = Card.objects.filter(client=request.user).first()
        card_transfers = CardTransfer.objects.filter(recipient=card).order_by('-created_at')
        serializer = self.serializer_class(card_transfers, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


class CardDepositTransferGetterList(APIView):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = CardDepositTransferSerializerInfo
    authentication_classes = [JWTAuthentication]

    def get(self, request):
        card = Card.objects.filter(client=request.user).first()
        card_transfers = DepositTransfer.objects.filter(sender_card=card, message='Снятие').order_by('-created_at')
        serializer = self.serializer_class(card_transfers, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


class CardDepositTransferSenderList(APIView):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = CardDepositTransferSerializerInfo
    authentication_classes = [JWTAuthentication]

    def get(self, request):
        card = Card.objects.filter(client=request.user).first()
        card_transfers = DepositTransfer.objects.filter(sender_card=card, message__in=['Пополнение', 'Депозитная ставка']).order_by('-created_at')
        serializer = self.serializer_class(card_transfers, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


class PayTransferSenderList(APIView):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = PayTransferSerializerInfo
    authentication_classes = [JWTAuthentication]

    def get(self, request):
        card = Card.objects.filter(client=request.user).first()
        pay_transfers = PaymentCompanyTransfers.objects.filter(card=card).order_by('-created_at')
        serializer = self.serializer_class(pay_transfers, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


class CreditTransferList(generics.CreateAPIView):
    permission_classes = [permissions.IsAuthenticated]
    authentication_classes = [JWTAuthentication]
    serializer_class = CreditTransferSerializer

    def create(self, request, *args, **kwargs):
        credit = get_object_or_404(Credit, id=request.data.get('credit'))
        card = Card.objects.filter(client=request.user).first()
        amount = int(request.data.get('amount'))
        if amount is None or card.sum < amount:
            return Response({'error': 'Not enough funds on the card.'}, status=400)
        card.sum -= amount
        card.save()

        bank = Bank.objects.first()
        bank.sum += amount
        bank.save()

        credit.sum_pog += amount
        credit.save()
        CreditTransfers.objects.create(
            client=request.user,
            credit=credit,
            sum=amount,
            card=card,
        )
        return Response({'success': 'Payment has been made successfully.'}, status=201)


class CreditTransferHistoryList(APIView):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = CreditTransferHistorySerializer
    authentication_classes = [JWTAuthentication]

    def get(self, request):
        credit = Credit.objects.filter(client=request.user).first()
        credit_transfers = CreditTransfers.objects.filter(credit=credit).order_by('-created_at')
        serializer = self.serializer_class(credit_transfers, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


class PaymentCompanyCategoriesList(generics.ListAPIView):
    permission_classes = [permissions.AllowAny]
    queryset = PaymentCompanyCategories.objects.all()
    serializer_class = PaymentCompanyCategoriesSerializer


class PaymentCompanyList(generics.ListAPIView):
    permission_classes = [permissions.AllowAny]
    serializer_class = PaymentCompanySerializer

    def get_queryset(self):
        name = self.kwargs['name']
        queryset = PaymentCompany.objects.filter(kind__name=name)
        return queryset
